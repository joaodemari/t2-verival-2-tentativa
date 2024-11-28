import { Module } from '@nestjs/common';
import { ProductsModule } from '../api/products/products.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ContractorCompaniesModule } from './contractorCompanies/contractorCompanies.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ClientModule,
    ContractorCompaniesModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
  providers: [],
})
export class ApiModule {}
