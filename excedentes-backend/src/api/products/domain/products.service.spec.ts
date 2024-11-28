import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductEntity } from '../product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractorCompaniesEntity } from '../../contractorCompanies/contractorCompanies.entity';
import { AddressEntity } from '../../contractorCompanies/address.entity';
import { ContractorCompaniesModule } from '../../contractorCompanies/contractorCompanies.module';
import { S3Module } from '../../../s3/s3.module';
import { ClientModule } from '../../client/client.module';
import { ProductsController } from '../products.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { S3Service } from '../../../s3/s3.service';
import { CreateProductDto } from '../dto/createProductDto';
import { ContractorCompaniesService } from '../../contractorCompanies/domain/contractorCompanies.service';
import { CreateContractorCompaniesDto } from '../../contractorCompanies/dto/createContractorCompanies.dto';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity, ContractorCompaniesEntity, AddressEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    ProductEntity,
    ContractorCompaniesEntity,
    AddressEntity,
  ]),
];

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: Repository<ProductEntity>;
  let s3Service: S3Service;
  let contractorCompaniesService: ContractorCompaniesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeOrmSQLITETestingModule(),
        ContractorCompaniesModule,
        S3Module,
        ClientModule,
        AuthModule,
      ],
      providers: [ProductsService, ContractorCompaniesService],
      controllers: [ProductsController],
      exports: [ProductsService],
    }).compile();

    contractorCompaniesService = moduleRef.get(ContractorCompaniesService);

    productsService = moduleRef.get(ProductsService);
    productRepository = moduleRef.get('ProductEntityRepository');
    s3Service = moduleRef.get(S3Service);
  });

  afterEach(async () => {
    await productRepository.clear();
  });

  it('should create and return a product with all valid fields', async () => {
    jest
      .spyOn(s3Service, 'uploadFile')
      .mockResolvedValue('https://s3.bucket/picture.png');

    const mockContractorCompany: CreateContractorCompaniesDto = {
      name: 'Empresa Exemplo',
      email: 'contato@empresaexemplo.com',
      address: {
        formattedName: 'Rua Exemplo',
        latitude: '-23.56168',
        longitude: '-46.656139',
      },
      cnpj: '12.345.678/0001-99',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
      workingHours: '08:00-18:00',
    };

    const contractorCompany = await contractorCompaniesService.create(
      mockContractorCompany,
    );

    const mockProductDto: CreateProductDto = {
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: new Date('2024-04-10'),
      category: 'Frutas',
      picture: 'https://www.google.com.br/image.png',
      bar_code: '1234567890123',
    };

    const result = await productsService.create(
      mockProductDto,
      contractorCompany.id,
    );

    expect(result).toMatchObject({
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: new Date('2024-04-10'),
      category: 'Frutas',
      picture: 'https://s3.bucket/picture.png',
      bar_code: '1234567890123',
    });

    const savedProduct = await productRepository.findOne({
      where: { id: result.id },
    });
    expect(savedProduct).not.toBeNull();
    expect(savedProduct).toMatchObject({
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: new Date('2024-04-10'),
      category: 'Frutas',
      picture: 'https://s3.bucket/picture.png',
      bar_code: '1234567890123',
    });
  });

  it('should throw an error if required fields are missing', async () => {
    const mockInvalidProductDto: Partial<CreateProductDto> = {
      description: 'Produto sem nome e preço',
    };

    await expect(
      productsService.create(mockInvalidProductDto as CreateProductDto, 1),
    ).rejects.toThrow();
  });
});