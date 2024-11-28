import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDTO {
  @ApiProperty({
    example: 'Rua Principal, 123, Cidade - Estado',
    description: 'Endereço formatado',
    required: true,
  })
  @IsNotEmpty({ message: 'Endereço é obrigatório.' })
  @IsString()
  formattedName: string;

  @ApiProperty({
    example: '-23.56168',
    description: 'Latitude',
    required: true,
  })
  @IsNotEmpty({ message: 'Latitude é obrigatória.' })
  @IsString()
  latitude: string;

  @ApiProperty({
    example: '-46.656139',
    description: 'Longitude',
    required: true,
  })
  @IsNotEmpty({ message: 'Longitude é obrigatória.' })
  @IsString()
  longitude: string;
}
