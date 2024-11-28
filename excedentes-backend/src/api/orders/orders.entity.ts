import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';
import { ClientEntity } from '../client/client.entity';

@Entity('pedidos')
export class OrderEntity extends BaseEntity {
  @ManyToOne(() => ClientEntity)
  @JoinColumn()
  client: ClientEntity;

  @Column({ type: 'int', nullable: true })
  code: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_value: number;

  @Column({ type: 'date', nullable: true })
  order_date: Date;

  @Column({ type: 'bool', nullable: false })
  open: boolean;
}
