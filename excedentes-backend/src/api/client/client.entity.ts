import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entities/base.entity';
import { TipoCliente } from './domain/enums/tipo-cliente.enum';

@Entity('clientes')
export class ClientEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 14,
    unique: true,
    name: 'cpf_cnpj',
  })
  cpf_cnpj: string;

  @Column({
    type: 'enum',
    enum: TipoCliente,
    nullable: false,
    name: 'tipo_cliente',
  })
  tipo: TipoCliente;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nome: string;

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

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isOng: boolean;
}
export { TipoCliente };
