import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsCNPJ } from '../../../api/commons/validators/isCnpj';
import { IsEqualTo } from '../../../api/commons/validators/isEqualTo';
import { AddressDTO } from './adress.dto';

export class CreateContractorCompaniesDto {
  @ApiProperty({
    example: 'Empresa Joao',
    description: 'Nome da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '12345678000195',
    description: 'Número do CNPJ da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'CNPJ é obrigatório.' })
  @IsString()
  @MinLength(14, { message: 'CNPJ deve ter 14 caracteres.' })
  @MaxLength(14, { message: 'CNPJ deve ter 14 caracteres.' })
  @IsCNPJ({ message: 'CNPJ inválido.' })
  cnpj: string;

  @ApiProperty({
    example: {
      formattedName: 'Rua Principal, 123, Cidade - Estado',
      latitude: '-23.56168',
      longitude: '-46.656139',
    },
    description: 'Endereço da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Endereço é obrigatório.' })
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsObject()
  address: AddressDTO;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(5, { message: 'Senha deve ter no mínimo 5 caracteres.' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Confirmação da senha da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória.' })
  @IsString()
  @MinLength(5, { message: 'Senha deve ter no mínimo 5 caracteres.' })
  @IsEqualTo('password', { message: 'As senhas não são iguais.' })
  confirmPassword: string;

  @ApiProperty({
    example: 'batata@gmail.com',
    description: 'Email da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '8:00 - 18:00',
    description: 'Horário comercial da empresa',
    required: true,
  })
  @IsNotEmpty({ message: 'Horário de trabalho é obrigatório.' })
  @IsString()
  workingHours: string;
}
