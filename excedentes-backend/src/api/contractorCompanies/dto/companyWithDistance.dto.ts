import { ContractorCompaniesEntity } from '../contractorCompanies.entity';

export interface CompanyWithDistanceDto extends ContractorCompaniesEntity {
  distance: number;
}
