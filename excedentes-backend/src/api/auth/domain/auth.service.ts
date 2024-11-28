import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../../../api/client/domain/client.service';
import { ContractorCompaniesService } from '../../../api/contractorCompanies/domain/contractorCompanies.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private companyService: ContractorCompaniesService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const client = await this.clientService.findByEmail(email);

    if (client) {
      const passwordMatch = await bcrypt.compare(password, client.password);

      if (!passwordMatch) {
        throw new UnauthorizedException(`Senha incorreta.`);
      }
      const payload = { email, sub: client.id };
      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '7d',
        }),
        userType: 'client',
      };
    }

    const company = await this.companyService.findByEmail(email);
    if (company) {
      const passwordMatch = await bcrypt.compare(password, company.password);

      if (!passwordMatch) {
        throw new UnauthorizedException(`Senha incorreta.`);
      }
      const payload = { email, sub: company.id };
      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '7d',
        }),
        userType: 'company',
      };
    }

    throw new BadRequestException(`Usuário não encontrado.`);
  }
}
