import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthModule } from '../src/api/auth/auth.module';
import { ClientEntity, TipoCliente } from '../src/api/client/client.entity';
import { AddressEntity } from '../src/api/contractorCompanies/address.entity';
import { ContractorCompaniesEntity } from '../src/api/contractorCompanies/contractorCompanies.entity';
import { ProductEntity } from '../src/api/products/product.entity';
import { ProductsModule } from '../src/api/products/products.module';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/api/products/domain/products.service';
import { ContractorCompaniesService } from '../src/api/contractorCompanies/domain/contractorCompanies.service';
import { ClientService } from '../src/api/client/domain/client.service';
import { CreateProductDto } from '../src/api/products/dto/createProductDto';
import { CreateContractorCompaniesDto } from '../src/api/contractorCompanies/dto/createContractorCompanies.dto';
import { S3Service } from '../src/s3/s3.service';
import { AuthController } from '../src/api/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from '../src/api/api.module';
import { dbdatasource } from '../data.source';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../src/api/cart/cartItem.entity';
import { OrderEntity } from '../src/api/orders/orders.entity';
import { CreateClientDto } from '../src/api/client/dto/createClient.dto';

describe('ProductsController (e2e)', () => {
  let contractorCompany: ContractorCompaniesEntity;
  let app: INestApplication;
  let productsService: ProductsService;
  let contractorCompaniesService: ContractorCompaniesService;
  let clientsService: ClientService;
  let ContractorCompaniesEntityRepository: Repository<ContractorCompaniesEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.local',
          isGlobal: true,
        }),
        ApiModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'aws-0-us-west-1.pooler.supabase.com',
          port: 6543,
          username: 'postgres.yibpjqmzvcpkkeuzqxdz',
          password: 'Ln9r5@CB4eDfMW',
          database: 'postgres',
          synchronize: true,
          entities: [
            CartItemEntity,
            ClientEntity,
            AddressEntity,
            ContractorCompaniesEntity,
            OrderEntity,
            ProductEntity,
          ],
        }),
      ],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const productRepository: Repository<ProductEntity> = app.get(
      'ProductEntityRepository',
    );
    const companyRepository: Repository<ContractorCompaniesEntity> = app.get(
      'ContractorCompaniesEntityRepository',
    );
    const clientRepository: Repository<ClientEntity> = app.get(
      'ClientEntityRepository',
    );

    await productRepository.delete({});
    await companyRepository.delete({});
    await clientRepository.delete({});

    const productsService = app.get(ProductsService);
    const _contractorCompaniesService = app.get(ContractorCompaniesService);
    const clientsService = app.get(ClientService);
    const s3Service = app.get(S3Service);
    jest
      .spyOn(s3Service, 'uploadFile')
      .mockResolvedValue('https://s3.bucket/picture.png');

    const mockContractorCompany: CreateContractorCompaniesDto = {
      name: 'Empresa Exemplo',
      email: 'contato@empresaexemplo.com',
      address: {
        formattedName: 'Rua Exemplo',
        latitude: '-23.550520',
        longitude: '-46.633308',
      },
      cnpj: '12345678000199',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
      workingHours: '08:00-18:00',
    };
    contractorCompaniesService = _contractorCompaniesService;

    contractorCompany = await _contractorCompaniesService.create(
      mockContractorCompany,
    );

    const productExpiration = new Date();
    productExpiration.setFullYear(productExpiration.getFullYear() + 1);

    const mockProductDto: CreateProductDto = {
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: productExpiration,
      category: 'Frutas',
      picture: 'https://www.google.com.br/image.png',
      bar_code: '1234567890123',
    };

    const product1 = await productsService.create(
      mockProductDto,
      contractorCompany.id,
    );

    const mockClient: CreateClientDto = {
      email: 'client@example.com',
      cpf_cnpj: '12345678900',
      nome: 'Cliente Exemplo',
      password: 'senhaSegura123',
      tipo: TipoCliente.PessoaFisica,
    };

    await clientsService.create(mockClient);
  }, 1000000);

  beforeEach(async () => {});

  afterAll(async () => {
    await app.close();
  });

  it('should return products within the specified radius', async () => {
    const authController = app.get(AuthController);

    const authToken = await authController.login({
      email: 'client@example.com',
      password: 'senhaSegura123',
    });

    const response = await request(app.getHttpServer())
      .get('/products/location')
      .query({
        clientLatitude: -23.55562,
        clientLongitude: -46.533308,
        clientRadius: 100,
      })
      .set('Authorization', `Bearer ${authToken.access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      name: 'Banana',
      distance: expect.any(Number),
    });
  });

  it('should return 400 if no companies are within the radius', async () => {
    const authController = app.get(AuthController);

    const authToken = await authController.login({
      email: 'client@example.com',
      password: 'senhaSegura123',
    });

    const response = await request(app.getHttpServer())
      .get('/products/location')
      .query({
        clientLatitude: -23.55562,
        clientLongitude: -46.533308,
        clientRadius: 10,
      })
      .set('Authorization', `Bearer ${authToken.access_token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Nenhuma empresa encontrada no raio especificado',
    );
  });

  it('should return 401 if the request is unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/location')
      .query({
        clientLatitude: 23,
        clientLongitude: 46,
        clientRadius: 10,
      });

    expect(response.status).toBe(401);
  });
});
