import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';
import { ContractorCompaniesEntity } from '../contractorCompanies/contractorCompanies.entity';

@Entity('alimentos')
export class ProductEntity extends BaseEntity {
  @ManyToOne(() => ContractorCompaniesEntity)
  @JoinColumn()
  company: ContractorCompaniesEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ length: 255, nullable: true })
  brand: string;

  @Column({ type: 'date' })
  expiration_date: Date;

  @Column({ length: 255 })
  category: string;

  @Column({ length: 255, nullable: true })
  picture: string;

  @Column({ length: 13, nullable: true })
  bar_code: string;
}
