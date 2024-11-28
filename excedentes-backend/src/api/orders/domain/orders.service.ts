import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemsService } from '../../../api/cart/domain/cartItems.service';
import { ClientService } from '../../../api/client/domain/client.service';
import { ProductsService } from '../../../api/products/domain/products.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../orders.entity';
import { CartItemEntity } from '../../../api/cart/cartItem.entity';
import { EmailService } from '../../../api/email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly clientService: ClientService,
    private readonly cartItemService: CartItemsService,
    private readonly productService: ProductsService,
    private readonly emailService: EmailService,
  ) {}

  async create(client_id: number): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create({
      client: { id: client_id },
      open: true,
    });
    await this.orderRepository.save(newOrder);
    return newOrder;
  }

  async getOrderCart(order_id: number): Promise<any[]> {
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
    });
    const orderItems = await this.cartItemService.getOrderItems(order.id);

    const cart = await Promise.all(
      orderItems.map(async (item) => {
        const seller = await this.productService.getSeller(item.product.id);
        return {
          order_id: item.order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_quantity: item.product.quantity,
          expiration_date: item.product.expiration_date,
          seller_id: seller.id,
          seller_name: seller.name,
          quantity: item.quantity,
          price: item.price,
        };
      }),
    );

    return cart;
  }

  async getOpenOrderCart(client_id: number): Promise<any[]> {
    const order = await this.getOpenOrder(client_id);

    if (!order) {
      throw new NotFoundException(
        `Carrinho aberto não encontrado para o cliente com ID ${client_id}`,
      );
    }

    const orderItems = await this.cartItemService.getOrderItems(order.id);
    const date = new Date(Date.now());
    const cart = await Promise.all(
      orderItems
        .filter((item) => item.product != null)
        .map(async (item) => {
          const seller = await this.productService.getSeller(item.product.id);

          return {
            cart_item_id: item.id,
            order_id: item.order.id,
            product_id: item.product.id,
            product_name: item.product.name,
            product_quantity: item.product.quantity,
            expiration_date: item.product.expiration_date,
            seller_id: seller.id,
            seller_name: seller.name,
            quantity: item.quantity,
            price: this.productService.calculateDynamicPrice(
              item.product,
              date,
            ),
          };
        }),
    );

    return cart;
  }

  async getOpenOrderCartPrice(client_id: number): Promise<number> {
    const order = await this.getOpenOrderCart(client_id);
    let total: number;
    total = 0;
    order.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  async getPastOrders(client_id: number): Promise<any[]> {
    const orders = await this.orderRepository.find({
      where: { client: { id: client_id }, open: false },
    });

    const orderDtos = await Promise.all(
      orders.map(async (order) => {
        const cart = await this.getOrderCart(order.id);
        return {
          id: order.id,
          client_id: client_id,
          code: order.code,
          total_value: order.total_value,
          order_date: order.order_date,
          open: order.open,
          cart: cart,
        };
      }),
    );

    return orderDtos;
  }

  async getPastOrder(client_id: number, order_id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: order_id, client: { id: client_id }, open: false },
    });

    if (!order) {
      throw new NotFoundException(
        `Pedido com ID ${order_id} para o usuário com ID ${client_id} não encontrado`,
      );
    }
    const cart = await this.getOrderCart(order.id);
    return {
      id: order.id,
      client_id: client_id,
      code: order.code,
      total_value: order.total_value,
      order_date: order.order_date,
      open: order.open,
      cart: cart,
    };
  }

  async addItemToCart(client_id: number, product_id: number, quantity: number) {
    const product = await this.productService.findOne(product_id);
    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${product_id} não encontrado`,
      );
    }
    if (product.quantity < quantity) {
      throw new NotFoundException(
        `Não há produtos com ID ${product_id} suficientes em estoque`,
      );
    }

    const order = await this.getOpenOrder(client_id);
    let order_id: number;

    if (order) {
      order_id = order.id;
    } else {
      const newOrder = await this.create(client_id);
      order_id = newOrder.id;
    }

    await this.cartItemService.addItem(
      order_id,
      product_id,
      quantity,
      product.quantity,
    );

    const updatedOrder = await this.getOpenOrder(client_id);

    const totalValue = await this.getOpenOrderCartPrice(client_id);

    return {
      id: updatedOrder.id,
      client_id: client_id,
      code: null,
      total_value: totalValue,
      order_date: null,
      open: updatedOrder.open,
      cart: await this.getOpenOrderCart(client_id),
    };
  }

  async deleteItem(itemId: number, userId: number): Promise<CartItemEntity> {
    const item = await this.cartItemService.getById(itemId);
    if (!item) throw new NotFoundException();
    const cart = await this.orderRepository.findOne({
      where: { id: item.order as unknown as number },
      loadRelationIds: true,
    });
    if ((cart.client as unknown as number) !== userId)
      throw new ForbiddenException();
    return this.cartItemService.deleteModel(item);
  }

  private async getOpenOrder(client_id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      loadRelationIds: true,
      where: { client: { id: client_id }, open: true },
    });

    return order;
  }

  async updateItemQuantity(
    client_id: number,
    product_id: number,
    quantity: number,
  ) {
    const order = await this.getOpenOrder(client_id);
    if (!order) {
      throw new NotFoundException(
        `Não há carrinho aberto para o usuário com ID ${client_id}`,
      );
    }

    const product = await this.productService.findOne(product_id);
    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${product_id} não encontrado`,
      );
    }

    await this.cartItemService.updateItemQuantity(
      order.id,
      product_id,
      quantity,
    );

    const updatedOrder = await this.getOpenOrder(client_id);

    const totalValue = await this.getOpenOrderCartPrice(client_id);

    return {
      id: updatedOrder.id,
      client_id: client_id,
      code: null,
      total_value: totalValue,
      order_date: null,
      open: updatedOrder.open,
      cart: await this.getOpenOrderCart(client_id),
    };
  }

  async finishOrder(client_id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { client: { id: client_id }, open: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Carrinho aberto não encontrado para o cliente com ID ${client_id}`,
      );
    }

    const orderItems = await this.cartItemService.getOrderItems(order.id);
    if (orderItems.length == 0) {
      throw new NotFoundException(
        `Nenhum produto encontrado no carrinho do cliente com ID ${client_id}`,
      );
    }

    const isOng = await this.clientService.isOng(client_id);
    const date = new Date(Date.now());
    let totalPrice = 0;

    for (const item of orderItems) {
      const product = await this.productService.findOne(item.product.id, true);
      item.product = product;
      const expirationDate = new Date(product.expiration_date);
      const daysToExpiration = Math.ceil(
        (expirationDate.getTime() - date.getTime()) / (1000 * 3600 * 24),
      );
      if (daysToExpiration <= 0) {
        throw new NotFoundException(
          `Produto com ID ${item.product.id} está expirado e não pode ser comprado`,
        );
      }
      if (!isOng && daysToExpiration <= 3) {
        throw new NotFoundException(
          `Produto com ID ${item.product.id} está perto da expiração e não pode ser comprado por este usuário`,
        );
      }
      if (product.quantity < item.quantity) {
        throw new NotFoundException(
          `Produto com ID ${item.product.id} não possui quantidade suficiente em estoque`,
        );
      }
    }

    for (const item of orderItems) {
      const price: number = this.productService.calculateDynamicPrice(
        item.product,
        date,
      );
      await this.cartItemService.savePrice(order.id, item.product.id, price);
      totalPrice += price * item.quantity;
      this.productService.detractStock(item.product.id, item.quantity);
    }

    order.total_value = totalPrice;
    order.order_date = date;
    order.open = false;
    order.code = Math.floor(Math.random() * 1000000);

    await this.orderRepository.save(order);

    const updatedOrderItems = await this.getOrderCart(order.id);

    this.emailService.sendConfirmationEmailToCustomer({
      clientId: client_id,
      orderCode: order.code,
      orderItems,
    });
    this.emailService.sendConfirmationEmailToContractors({
      orderCode: order.code,
      orderItems,
    });

    return {
      message: 'Compra finalizada com sucesso',
      order: {
        id: order.id,
        client_id: client_id,
        code: order.code,
        total_value: order.total_value,
        order_date: order.order_date,
        items: updatedOrderItems,
      },
    };
  }
}
