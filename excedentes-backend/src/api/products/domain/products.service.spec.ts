import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductEntity } from '../product.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractorCompaniesEntity } from '../../contractorCompanies/contractorCompanies.entity';
import { AddressEntity } from '../../contractorCompanies/address.entity';
import { ContractorCompaniesModule } from '../../contractorCompanies/contractorCompanies.module';
import { S3Module } from '../../../s3/s3.module';
import { ClientModule } from '../../client/client.module';
import { ProductsController } from '../products.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { S3Service } from '../../../s3/s3.service';
import { CreateProductDto } from '../dto/createProductDto';
import { ContractorCompaniesService } from '../../contractorCompanies/domain/contractorCompanies.service';
import { CreateContractorCompaniesDto } from '../../contractorCompanies/dto/createContractorCompanies.dto';
import { ClientService } from '../../client/domain/client.service';
import { ClientEntity, TipoCliente } from '../../client/client.entity';
import { CreateClientDto } from '../../client/dto/createClient.dto';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity, ContractorCompaniesEntity, AddressEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    ProductEntity,
    ContractorCompaniesEntity,
    AddressEntity,
  ]),
];

export const repositoryMockFactory = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}));

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: Repository<ProductEntity>;
  let s3Service: S3Service;
  let contractorCompaniesService: ContractorCompaniesService;
  let clientsService: ClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeOrmSQLITETestingModule(),
        ContractorCompaniesModule,
        S3Module,
        ClientModule,
        AuthModule,
      ],
      providers: [
        ProductsService,
        ContractorCompaniesService,
        ClientService,
        {
          provide: getRepositoryToken(ClientEntity),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [ProductsController],
      exports: [ProductsService],
    }).compile();

    contractorCompaniesService = moduleRef.get(ContractorCompaniesService);
    clientsService = moduleRef.get(ClientService);
    productsService = moduleRef.get(ProductsService);
    productRepository = moduleRef.get('ProductEntityRepository');
    s3Service = moduleRef.get(S3Service);
  });

  afterEach(async () => {
    await productRepository.clear();
  });

  it('should create and return a product with all valid fields', async () => {
    jest
      .spyOn(s3Service, 'uploadFile')
      .mockResolvedValue('https://s3.bucket/picture.png');

    const mockContractorCompany: CreateContractorCompaniesDto = {
      name: 'Empresa Exemplo',
      email: 'contato@empresaexemplo.com',
      address: {
        formattedName: 'Rua Exemplo',
        latitude: '-23.56168',
        longitude: '-46.656139',
      },
      cnpj: '12.345.678/0001-99',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
      workingHours: '08:00-18:00',
    };

    const contractorCompany = await contractorCompaniesService.create(
      mockContractorCompany,
    );

    const mockProductDto: CreateProductDto = {
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: new Date('2024-04-10'),
      category: 'Frutas',
      picture: 'https://www.google.com.br/image.png',
      bar_code: '1234567890123',
    };

    const result = await productsService.create(
      mockProductDto,
      contractorCompany.id,
    );

    expect(result).toMatchObject({
      name: 'Banana',
      description: 'Fruta tropical deliciosa',
      price: 1.5,
      quantity: 50,
      brand: 'Frutas Tropicais',
      expiration_date: result.expiration_date,
      category: 'Frutas',
      picture: 'https://s3.bucket/picture.png',
      bar_code: '1234567890123',
    });

    const savedProduct = await productRepository.findOne({
      where: { id: result.id },
    });
    expect(savedProduct).not.toBeNull();
  });

  it('should return products from companies within the specified radius', async () => {
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
      cnpj: '12.345.678/0001-99',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
      workingHours: '08:00-18:00',
    };

    const contractorCompany = await contractorCompaniesService.create(
      mockContractorCompany,
    );

    jest
      .spyOn(productsService, 'getAllCompanies')
      .mockResolvedValue([contractorCompany]);

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

    jest.spyOn(productRepository, 'query').mockResolvedValue([product1]);
    const mockClient: ClientEntity = {
      id: 1,
      createdAt: new Date(),
      isOng: true,
      updatedAt: new Date(),
      email: 'client@example.com',
      cpf_cnpj: '123.456.789-00',
      nome: 'Cliente Exemplo',
      password: 'senhaSegura123',
      tipo: TipoCliente.PessoaFisica,
    };

    jest.spyOn(clientsService, 'findOne').mockResolvedValue(mockClient);

    const result = await productsService.findByLocation(
      {
        sub: mockClient.id,
        email: mockClient.email,
      },
      -23.55562,
      -46.533308,
      20,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Banana',
      distance: expect.any(Number),
    });
  });

  it('given the distance between longitudes and latitudeas are more than 10km, should return 0 products from companies within the specified radius', async () => {
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
      cnpj: '12.345.678/0001-99',
      password: 'senhaSegura123',
      confirmPassword: 'senhaSegura123',
      workingHours: '08:00-18:00',
    };

    const contractorCompany = await contractorCompaniesService.create(
      mockContractorCompany,
    );

    jest
      .spyOn(productsService, 'getAllCompanies')
      .mockResolvedValue([contractorCompany]);

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

    jest.spyOn(productRepository, 'query').mockResolvedValue([product1]);
    const mockClient: ClientEntity = {
      id: 1,
      createdAt: new Date(),
      isOng: true,
      updatedAt: new Date(),
      email: 'client@example.com',
      cpf_cnpj: '123.456.789-00',
      nome: 'Cliente Exemplo',
      password: 'senhaSegura123',
      tipo: TipoCliente.PessoaFisica,
    };

    jest.spyOn(clientsService, 'findOne').mockResolvedValue(mockClient);

    try {
      const result = await productsService.findByLocation(
        {
          sub: mockClient.id,
          email: mockClient.email,
        },
        -23.55562,
        -46.533308,
        10,
      );
    } catch (e) {
      expect(e.message).toBe('Nenhuma empresa encontrada no raio especificado');
    }
  });
});
