import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoCliente } from '../client.entity';

export class CreateClientDto {
  @ApiProperty({
    example: 'Fulano de Tal',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: '00100100101',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  cpf_cnpj: string;

  @ApiProperty({
    example: 'fulanodetal@email.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pessoa Juridica',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tipo: TipoCliente;

  @ApiProperty({
    example: 'Batata123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
