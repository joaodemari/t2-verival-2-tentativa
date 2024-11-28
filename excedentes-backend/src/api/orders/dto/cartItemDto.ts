import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    example: '1',
    description: 'ID do pedido',
    required: true,
  })
  order_id: number;

  @ApiProperty({
    example: '1',
    description: 'ID do produto',
    required: true,
  })
  product_id: number;

  @ApiProperty({
    example: 'Banana',
    description: 'nome do produto',
    required: true,
  })
  product_name: string;

  @ApiProperty({
    example: '1',
    description: 'ID do usuário vendedor do produto',
    required: true,
  })
  seller_id: number;

  @ApiProperty({
    example: 'Zaffari Ipiranga',
    description: 'Nome do usuário vendedor do produto',
    required: true,
  })
  seller_name: string;

  @ApiProperty({
    example: '5',
    description: 'quantidade do produto',
    required: true,
  })
  quantity: number;

  @ApiProperty({
    example: '10.00',
    description: 'preço total dos produtos',
    required: true,
  })
  price: number;
}
