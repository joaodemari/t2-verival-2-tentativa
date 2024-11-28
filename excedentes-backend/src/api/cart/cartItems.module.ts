import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from './cartItem.entity';
import { CartItemsService } from './domain/cartItems.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity])],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
