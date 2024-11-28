import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { ContractorCompaniesModule } from '../contractorCompanies/contractorCompanies.module';
import { EmailService } from './email.service';

@Module({
  imports: [ClientModule, ContractorCompaniesModule],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
