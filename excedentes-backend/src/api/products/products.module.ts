import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './domain/products.service';
import { ProductEntity } from './product.entity';
import { ProductsController } from './products.controller';
import { S3Module } from '../../s3/s3.module';
import { ContractorCompaniesModule } from '../contractorCompanies/contractorCompanies.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ContractorCompaniesModule,
    S3Module,
    ClientModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
