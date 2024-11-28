import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';
import { AddressEntity } from './address.entity';

@Entity('contractor-companies')
export class ContractorCompaniesEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @OneToOne(() => AddressEntity, { eager: true, cascade: true })
  @JoinColumn()
  address: AddressEntity;

  @Column({
    type: 'varchar',
    length: 14,
    nullable: false,
    unique: true,
  })
  cnpj: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  workingHours: string;
}
