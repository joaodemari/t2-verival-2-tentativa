import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';
import { AddressEntity } from '../address.entity';
import { ContractorCompaniesEntity } from '../contractorCompanies.entity';
import { CreateContractorCompaniesDto } from '../dto/createContractorCompanies.dto';

@Injectable()
export class ContractorCompaniesService {
  constructor(
    @InjectRepository(ContractorCompaniesEntity)
    private readonly contractorCompaniesRepository: Repository<ContractorCompaniesEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}
  async findAll(): Promise<ContractorCompaniesEntity[]> {
    return await this.contractorCompaniesRepository.find({
      relations: ['address'],
    });
  }

  async findByEmail(email: string): Promise<ContractorCompaniesEntity> {
    return await this.contractorCompaniesRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: number): Promise<ContractorCompaniesEntity> {
    return await this.contractorCompaniesRepository.findOne({
      where: { id: id },
    });
  }

  async findByIdList(ids: number[]): Promise<ContractorCompaniesEntity[]> {
    return await this.contractorCompaniesRepository.find({
      where: { id: In(ids) },
      relations: ['address'],
    });
  }

  async create(
    createDto: CreateContractorCompaniesDto,
  ): Promise<ContractorCompaniesEntity> {
    const { email, cnpj, password } = createDto;
    const existingEmail = await this.contractorCompaniesRepository.findOne({
      where: { email },
    });
    const existingCnpj = await this.contractorCompaniesRepository.findOne({
      where: { cnpj },
    });

    if (existingEmail) {
      throw new HttpException('Email já em uso.', HttpStatus.CONFLICT);
    }

    if (existingCnpj) {
      throw new HttpException('CNPJ já em uso.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const address = this.addressRepository.create(createDto.address);
    await this.addressRepository.save(address);

    const entity = this.contractorCompaniesRepository.create({
      ...createDto,
      password: hashedPassword,
      address,
    });

    return await this.contractorCompaniesRepository.save(entity);
  }

  async update(
    id: number,
    updateDto: CreateContractorCompaniesDto,
  ): Promise<ContractorCompaniesEntity> {
    const existingEntity = await this.contractorCompaniesRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (!existingEntity) {
      throw new NotFoundException(`Empresa contratante não encontrada.`);
    }

    if (updateDto.address) {
      const address = await this.addressRepository.preload({
        id: existingEntity.address.id,
        ...updateDto.address,
      });

      if (!address) {
        throw new NotFoundException(`Endereço não encontrado.`);
      }

      await this.addressRepository.save(address);
      existingEntity.address = address;
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    this.contractorCompaniesRepository.merge(existingEntity, updateDto);

    return await this.contractorCompaniesRepository.save(existingEntity);
  }

  async delete(id: number): Promise<string> {
    const result = await this.contractorCompaniesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Empresa contratante não encontrada.`);
    }
    return `Empresa contratante deletada com sucesso.`;
  }
}
