import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';
import { ContractorCompaniesController } from './contractorCompanies.controller';
import { ContractorCompaniesEntity } from './contractorCompanies.entity';
import { ContractorCompaniesService } from './domain/contractorCompanies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractorCompaniesEntity, AddressEntity]),
  ],
  controllers: [ContractorCompaniesController],
  providers: [ContractorCompaniesService],
  exports: [ContractorCompaniesService],
})
export class ContractorCompaniesModule {}
