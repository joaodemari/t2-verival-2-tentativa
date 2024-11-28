import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core';
import { ClientEntity } from '../client.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from '../dto/createClient.dto';
import * as bcrypt from 'bcrypt';
import { isOng } from '../../../api/commons/validators/isOng';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
  ) {}

  async findAll(): Promise<ClientEntity[]> {
    return this.clientsRepository.find();
  }

  async findOne(id: number): Promise<ClientEntity> {
    return await this.clientsRepository.findOne({
      where: { id },
    });
  }

  async findOneBycpf_cnpj(cpf_cnpj: string): Promise<ClientEntity> {
    const numbcpf = cpf_cnpj;

    return await this.clientsRepository.findOne({
      where: { cpf_cnpj: numbcpf },
    });
  }

  async create(createdto: CreateClientDto): Promise<ClientEntity> {
    const { email, cpf_cnpj, password } = createdto;
    let isCnpjOng = false;

    if (cpf_cnpj.length == 14) {
      try {
        isCnpjOng = await isOng(cpf_cnpj);
      } catch {
        console.log(
          '[WARNING]: CNPJ falso foi inserido, cadastrando como usuário comum',
        );
      }
    }

    const existeEmail = await this.clientsRepository.findOne({
      where: { email },
    });

    if (existeEmail) {
      throw new HttpException(
        'Este email já está sendo utilizado',
        HttpStatus.CONFLICT,
      );
    }

    const existeCpf = await this.clientsRepository.findOne({
      where: { cpf_cnpj },
    });

    if (existeCpf) {
      throw new HttpException(
        'Este CPF/CNPJ já está sendo utilizado',
        HttpStatus.CONFLICT,
      );
    }

    const hashSenha = await bcrypt.hash(password, 10);
    const entity = this.clientsRepository.create({
      ...createdto,
      password: hashSenha,
      isOng: isCnpjOng,
    } as DeepPartial<ClientEntity>);

    return this.clientsRepository.save(entity);
  }

  async update(
    cpf_cnpj: string,
    updatedto: CreateClientDto,
  ): Promise<ClientEntity> {
    const criteria = { cpf_cnpj: cpf_cnpj };
    const partialEntity = { ...criteria, ...updatedto };

    await this.clientsRepository.update(criteria, partialEntity);

    const entity = await this.clientsRepository.findOne({ where: criteria });

    return entity!;
  }

  async delete(cpf_cnpj: string): Promise<void> {
    const res = await this.clientsRepository.softDelete(cpf_cnpj);
    if (res.affected == 0) {
      throw new NotFoundException('Cliente com o CPF/CNPJ não encontrado');
    }
  }

  async findByEmail(email: string): Promise<ClientEntity> {
    return this.clientsRepository.findOne({ where: { email } });
  }

  async isOng(id: number): Promise<boolean> {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });
    return client.isOng;
  }
}
