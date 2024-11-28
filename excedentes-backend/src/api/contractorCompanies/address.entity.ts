import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';

@Entity('address')
export class AddressEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  formattedName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  latitude: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  longitude: string;
}
