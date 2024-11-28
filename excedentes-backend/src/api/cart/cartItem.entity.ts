import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';
import { OrderEntity } from '../orders/orders.entity';
import { ProductEntity } from '../products/product.entity';

@Entity()
export class CartItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, { nullable: false })
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, { nullable: false })
  @JoinColumn()
  product: ProductEntity;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;
}
