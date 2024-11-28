import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './orders.entity';
import { ProductsModule } from '../products/products.module';
import { CartItemsModule } from '../cart/cartItems.module';
import { ClientModule } from '../client/client.module';
import { OrdersService } from './domain/orders.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    CartItemsModule,
    ClientModule,
    ProductsModule,
    EmailModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
