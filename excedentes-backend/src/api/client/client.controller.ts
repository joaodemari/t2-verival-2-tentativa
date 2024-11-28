import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientService } from './domain/client.service';
import { CreateClientDto } from './dto/createClient.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Consumer')
@Controller('consumers')
export class ClientController {
  constructor(public service: ClientService) {}

  @ApiOperation({ summary: 'Procura os consumidors cadastrados' })
  @ApiQuery({
    name: 'cpf_cnpj',
    required: false,
    description: 'CPF/CNPJ do Comsumidor',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('cpf_cnpj') cpf_cnpj: string) {
    if (cpf_cnpj) {
      return await this.service.findOneBycpf_cnpj(cpf_cnpj);
    }
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Cadastra um consumidor' })
  @ApiResponse({ status: 201, description: 'Cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Informações inválidas' })
  @ApiResponse({ status: 409, description: 'Consumidor ja castrado' })
  @Post()
  async create(@Body() createdto: CreateClientDto) {
    try {
      const client = await this.service.create(createdto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = client;
      return {
        statuscode: HttpStatus.CREATED,
        messagee: 'Consumidor cadastrado com sucesso',
        data: res,
      };
    } catch (erro) {
      throw new HttpException({ message: erro.message }, erro.status);
    }
  }

  @ApiOperation({ summary: 'Atualiza um consumidor' })
  @ApiResponse({ status: 200, description: 'Atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Consumidor não cadastrado.' })
  @ApiResponse({ status: 400, description: 'Informações inválidas.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':cpfcnpj')
  async update(
    @Param('cpfcnpj') cpfcnpj: string,
    @Body() updateCliente: CreateClientDto,
  ) {
    return await this.service.update(cpfcnpj, updateCliente);
  }

  @ApiOperation({ summary: 'Deleta um consumidor' })
  @ApiResponse({ status: 200, description: 'Consumidor deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Consumidor não cadastrado.' })
  @ApiResponse({ status: 400, description: 'Informações inválidas.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'cpfcnpj',
    type: String,
    required: true,
    description: 'CPF/CNPJ do cliente',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':cpfcnpj')
  async delete(@Param('cpfcnpj') cpfcnpj: string) {
    return await this.service.delete(cpfcnpj);
  }
}
