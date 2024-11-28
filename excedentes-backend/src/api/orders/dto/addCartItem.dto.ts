import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddCartItemDTO {
  @IsInt()
  @ApiProperty({
    example: '1',
    description: 'Quantidade do produto a ser adicionado',
    required: true,
  })
  @Min(1, { message: 'Quantidade deve ser pelo menos 1' })
  quantity: number;

  @ApiProperty({
    example: '1',
    description: 'ID do produto a ser adicionado',
    required: true,
  })
  @IsInt()
  product_id: number;
}
