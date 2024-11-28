import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/request';
import { OrdersService } from './domain/orders.service';
import { AddCartItemDTO } from './dto/addCartItem.dto';
import { CartItemDto } from './dto/cartItemDto';
import { OrderDto } from './dto/orderDto';
import { CartItemEntity } from '../cart/cartItem.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @ApiOperation({ summary: 'Adiciona um produto ao carrinho do usuário' })
  @ApiResponse({
    status: 201,
    description: 'Produto adicionado ao carrinho com sucesso.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/cart')
  async addItemToCart(
    @Body() addCartItemDTO: AddCartItemDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDto> {
    try {
      const { product_id, quantity } = addCartItemDTO;
      return await this.service.addItemToCart(
        req.user.sub,
        product_id,
        quantity,
      );
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status);
    }
  }

  @ApiOperation({ summary: 'Retorna os produtos no carrinho do usuário' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/cart')
  async getCart(@Request() req: AuthenticatedRequest): Promise<CartItemDto[]> {
    return await this.service.getOpenOrderCart(req.user.sub);
  }

  @ApiOperation({ summary: 'Remove um item do carrinho' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/cart-item/:id')
  async deleteCartItem(
    @Param('id') id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<CartItemEntity> {
    return await this.service.deleteItem(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Retorna o histórico de pedidos do usuário' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/past')
  async getPastOrders(
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDto[]> {
    return await this.service.getPastOrders(req.user.sub);
  }

  @ApiOperation({
    summary: 'Retorna um pedido passado do usuário a partir de um ID',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/past/:id')
  async getPastOrder(
    @Param('id') id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDto[]> {
    return await this.service.getPastOrder(req.user.sub, id);
  }

  @ApiOperation({ summary: 'Finaliza a compra do carrinho atual do usuário' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/buy/')
  async finishOrder(@Request() req: AuthenticatedRequest): Promise<OrderDto[]> {
    return await this.service.finishOrder(req.user.sub);
  }

  @ApiOperation({ summary: 'Atualiza a quantidade de um produto no carrinho' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/cart/update')
  async updateCartItem(
    @Body() addCartItemDTO: AddCartItemDTO,
    @Request() req: AuthenticatedRequest,
  ): Promise<OrderDto> {
    try {
      const { product_id, quantity } = addCartItemDTO;
      return await this.service.updateItemQuantity(
        req.user.sub,
        product_id,
        quantity,
      );
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status);
    }
  }
}
