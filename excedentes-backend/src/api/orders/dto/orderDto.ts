import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './cartItemDto';
import { IsArray } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    example: '1',
    description: 'ID do pedido',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: '1',
    description: 'ID do cliente',
    required: true,
  })
  client_id: number;

  @ApiProperty({
    example: '564934',
    description: 'codigo de retirada do pedido',
    required: false,
  })
  code: number;

  @ApiProperty({
    example: '50.00',
    description: 'Valor total, até o momento, do pedido',
    required: true,
  })
  total_value: number;

  @ApiProperty({
    example: '2024-04-10',
    description: 'data de finalização do pedido',
    required: false,
  })
  order_date: Date;

  @ApiProperty({
    example: 'true',
    description: 'status do pedido (aberto = carrinho, fechado = pedido feito)',
    required: true,
  })
  open: boolean;

  @IsArray()
  @ApiProperty({
    required: true,
    description: 'lista de items no carrinho do pedido',
  })
  cart: CartItemDto[];
}
