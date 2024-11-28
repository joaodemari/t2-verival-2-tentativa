import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: '1',
    description:
      'ID da empresa (temporario; será determinado pela empresa autenticada)',
    required: true,
  })
  @ApiProperty({
    example: 'Banana',
    description: 'nome do produto',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome nao pode ser vazio ' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'descricao do produto',
    description: 'descricao do produto',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: '1.00',
    description: 'Preço do produto',
    required: true,
  })
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '5',
    description: 'Quantidade do produto em estoque',
    required: true,
  })
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 'Tio Joao',
    description: 'Marca do produto',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty({
    example: '2024-04-10',
    description: 'Data de validade do produto',
    required: true,
  })
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  expiration_date: Date;

  @ApiProperty({
    example: 'Frutas',
    description: 'Categoria do produto',
    required: true,
  })
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'https://www.google.com.br/image.png',
    description: 'URL da imagem do produto',
    required: false,
  })
  @IsOptional()
  picture: string;

  @ApiProperty({
    example: '',
    description: 'codigo de barras dos produtos',
    required: false,
  })
  @IsOptional()
  bar_code: string;
}
