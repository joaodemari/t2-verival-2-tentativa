import { ProductEntity } from '../product.entity';

export interface ProductWithDistanceDto extends ProductEntity {
  distance: number;
}
