import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from '../dto/createProductDto';
import { ProductEntity } from '../product.entity';
import { S3Service } from '../../../s3/s3.service';
import { ClientService } from '../../../api/client/domain/client.service';
import { ContractorCompaniesEntity } from '../../../api/contractorCompanies/contractorCompanies.entity';
import { ContractorCompaniesService } from '../../../api/contractorCompanies/domain/contractorCompanies.service';
import { CompanyWithDistanceDto } from '../../../api/contractorCompanies/dto/companyWithDistance.dto';
import { ProductWithDistanceDto } from '../dto/productWithDistanceDto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private s3Service: S3Service,
    private readonly contractorCompaniesService: ContractorCompaniesService,
    private readonly clientService: ClientService,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: { quantity: MoreThan(0) },
    });
  }

  async findOne(id: number, loadCompany?: boolean): Promise<ProductEntity> {
    if (isNaN(id)) {
      throw new HttpException('Invalid product ID', 400);
    }

    const query = this.productRepository.createQueryBuilder('product');
    loadCompany && query.leftJoinAndSelect('product.company', 'company');
    const product = await query
      .where('product.id = :id', { id })
      .andWhere('product.deletedAt IS NULL')
      .andWhere('product.quantity != 0')
      .getOne();

    if (!product) {
      throw new HttpException('Product not found', 400);
    }

    return product;
  }

  async create(
    product: CreateProductDto,
    company_id: number,
  ): Promise<ProductEntity> {
    product.picture = await this.s3Service.uploadFile(
      product.picture,
      product.name,
    );

    const newProduct = this.productRepository.create({
      ...product,
      company: { id: company_id },
    });
    return await this.productRepository.save(newProduct);
  }

  async update(
    id: number,
    updateDto: CreateProductDto,
    company_id: number,
  ): Promise<ProductEntity> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: { company: true },
    });

    if (!entity) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (entity.company.id !== company_id) {
      throw new ForbiddenException();
    }

    if (entity.picture != updateDto.picture) {
      updateDto.picture = await this.s3Service.uploadFile(
        updateDto.picture,
        updateDto.name,
      );
    }

    await this.productRepository.update(id, updateDto);
    return this.productRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    product.deletedAt = new Date(Date.now());
    return await this.productRepository.save(product);
  }

  async findAllActiveByCompany(
    companyId: number,
    filterByExpirationDate: boolean,
  ): Promise<any[]> {
    const currentDate = new Date();
    const threeDaysAhead = new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000,
    );

    const products = await this.productRepository.find({
      where: {
        company: { id: companyId },
        quantity: MoreThan(0),
        deletedAt: null,
        expiration_date: filterByExpirationDate
          ? MoreThan(threeDaysAhead)
          : undefined,
      },
    });

    return products.map((product) => ({
      id: product.id,
      picture: product.picture,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: this.calculateDynamicPrice(product, currentDate),
      brand: product.brand,
      category: product.category,
      expirationDate: product.expiration_date,
    }));
  }

  async findByName(companyId: number, name: string): Promise<ProductEntity[]> {
    const products = await this.productRepository.findBy({
      name: ILike(`%${name}%`),
      deletedAt: IsNull(),
      company: { id: companyId },
    });

    if (!products) {
      throw new NotFoundException(`Product with name ${name} not found`);
    }

    return products;
  }

  async getAllCompanies(): Promise<ContractorCompaniesEntity[]> {
    return await this.contractorCompaniesService.findAll();
  }

  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async findByLocation(
    user: { sub: number; email: string },
    clientLatitude: number,
    clientLongitude: number,
    clientRadius: number,
  ): Promise<ProductWithDistanceDto[]> {
    const client = await this.clientService.findOne(user.sub);
    const companies: ContractorCompaniesEntity[] = await this.getAllCompanies();
    const inRangeCompanies: CompanyWithDistanceDto[] = [];
    const X1toRad = this.degToRad(clientLatitude);

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const X2toRad = this.degToRad(+company.address.latitude);
      const deltaLong = this.degToRad(
        clientLongitude - +company.address.longitude,
      );
      const distance =
        Math.acos(
          Math.cos(X1toRad) * Math.cos(X2toRad) * Math.cos(deltaLong) +
            Math.sin(X1toRad) * Math.sin(X2toRad),
        ) * 6371;

      if (clientRadius >= distance) {
        inRangeCompanies.push({ ...company, distance });
      }
    }

    if (inRangeCompanies.length === 0) {
      throw new HttpException(
        'Nenhuma empresa encontrada no raio especificado',
        400,
      );
    }

    const companyIds = inRangeCompanies.map((company) => company.id);
    let products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.company', 'company')
      .where('product.companyId IN (:...companyIds)', { companyIds })
      .andWhere('product.deletedAt IS NULL')
      .andWhere('product.quantity != 0')
      .andWhere('product.expiration_date > :today', {
        today: new Date(),
      })
      .getMany();

    products = products.filter((product) => {
      const dynamicPrice = this.calculateDynamicPrice(product, new Date());
      return client.isOng ? dynamicPrice === 0 : dynamicPrice > 0;
    });

    if (products.length === 0)
      throw new HttpException(
        'Nenhum produto encontrado no raio especificado',
        400,
      );
    return products.map((p) => {
      const company = inRangeCompanies.find((c) => c.id === p.company.id);
      return { ...p, distance: company.distance };
    });
  }

  calculateDynamicPrice(product: any, currentDate: Date): number {
    const daysForExpiration = 10;
    const expirationDate = new Date(product.expiration_date);
    const daysToExpiration = Math.ceil(
      (expirationDate.getTime() - currentDate.getTime()) /
        (daysForExpiration * 10 * 3600 * 24) /
        10,
    );

    if (daysToExpiration < 3) {
      product.price = 0; // gratis pra ongs
    } else if (daysToExpiration < 13) {
      const initialPrice = product.price;
      const daysOfDiscount = daysToExpiration - 2;
      const maxDiscountDays = 10;

      const priceReductionFactor = (maxDiscountDays - daysOfDiscount + 1) * 0.1;
      product.price = Math.max(
        0,
        initialPrice - initialPrice * priceReductionFactor,
      );
    }

    return product.price;
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return false;
    }
    product.deletedAt = new Date(Date.now());
    await this.productRepository.save(product);
    return true;
  }

  async detractStock(id: number, numBought: number) {
    const entity = await this.productRepository.findOne({
      where: { id },
    });
    entity.quantity = entity.quantity - numBought;
    await this.productRepository.save(entity);
  }

  async getSeller(id: number): Promise<{ id: number; name: string }> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        company: true,
      },
      select: {
        id: true,
        name: true,
        company: {
          id: true,
          name: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    const sellerId = product.company.id;
    const sellerName = product.company.name;

    return {
      id: sellerId,
      name: sellerName,
    };
  }
}
