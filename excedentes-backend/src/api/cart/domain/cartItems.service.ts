import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../cartItem.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async getById(id: number) {
    return this.cartItemRepository.findOne({
      where: { id },
      loadRelationIds: true,
      relations: {
        product: true,
        order: true,
      },
    });
  }

  async create(
    order_id: number,
    product_id: number,
    quantity: number,
  ): Promise<CartItemEntity> {
    const newCartItem = this.cartItemRepository.create({
      order: { id: order_id },
      product: { id: product_id },
      quantity,
    });
    return await this.cartItemRepository.save(newCartItem);
  }

  async update(
    order_id: number,
    product_id: number,
    quantity: number,
  ): Promise<CartItemEntity> {
    const entity = await this.cartItemRepository.findOne({
      relations: {
        product: true,
        order: true,
      },
      where: { order: { id: order_id }, product: { id: product_id } },
    });

    if (!entity) {
      throw new NotFoundException(
        `Cart item with product ID ${product_id} in order ID ${order_id} not found`,
      );
    }

    await this.cartItemRepository.update(
      { order: { id: order_id }, product: { id: product_id } },
      { quantity },
    );

    return await this.cartItemRepository.findOne({
      loadRelationIds: true,
      where: { order: { id: order_id }, product: { id: product_id } },
    });
  }

  async delete(order_id: number, product_id: number): Promise<CartItemEntity> {
    const item = await this.cartItemRepository.findOne({
      relations: {
        product: true,
        order: true,
      },
      loadRelationIds: true,
      where: { order: { id: order_id }, product: { id: product_id } },
    });

    if (!item) {
      throw new NotFoundException(`Este produto não está no carrinho.`);
    }

    await this.cartItemRepository.remove(item);

    return item;
  }

  async deleteModel(model: CartItemEntity): Promise<CartItemEntity> {
    return this.cartItemRepository.remove(model);
  }

  async addItem(
    order_id: number,
    product_id: number,
    quantity: number,
    quantityInStock: number,
  ): Promise<CartItemEntity> {
    const entity = await this.cartItemRepository.findOne({
      relations: {
        product: true,
        order: true,
      },
      loadRelationIds: true,
      where: { order: { id: order_id }, product: { id: product_id } },
    });

    let item: CartItemEntity;
    if (!entity) {
      item = await this.create(order_id, product_id, quantity);
    } else {
      if (quantityInStock < entity.quantity + quantity) {
        throw new NotFoundException(
          `Não há produtos com ID ${product_id} suficientes em estoque`,
        );
      } else {
        item = await this.update(
          order_id,
          product_id,
          entity.quantity + quantity,
        );
      }
    }

    return item;
  }

  async getOrderItems(order_id: number): Promise<CartItemEntity[]> {
    return await this.cartItemRepository.find({
      loadRelationIds: true,
      relations: {
        product: true,
        order: true,
      },
      select: {
        id: true,
        quantity: true,
        price: true,
        order: {
          id: true,
        },
        product: {
          id: true,
          name: true,
          quantity: true,
          expiration_date: true,
          price: true,
        },
      },
      where: { order: { id: order_id } },
    });
  }

  async getCurrentPrice(order_id: number): Promise<number> {
    const cart = await this.getOrderItems(order_id);
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
  }

  async updateItemQuantity(
    order_id: number,
    product_id: number,
    quantity: number,
  ) {
    const entity = await this.cartItemRepository.findOne({
      loadRelationIds: true,
      relations: {
        product: true,
        order: true,
      },
      where: { order: { id: order_id }, product: { id: product_id } },
    });

    if (!entity) {
      throw new NotFoundException(
        `Cart item with product ID ${product_id} in order ID ${order_id} not found`,
      );
    }

    await this.cartItemRepository.update(
      { order: { id: order_id }, product: { id: product_id } },
      { quantity },
    );
  }

  async savePrice(order_id: number, product_id: number, price: number) {
    await this.cartItemRepository.update(
      { order: { id: order_id }, product: { id: product_id } },
      { price },
    );
  }
}
