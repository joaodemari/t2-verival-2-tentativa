/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ContractorCompaniesService } from './domain/contractorCompanies.service';
import { CreateContractorCompaniesDto } from './dto/createContractorCompanies.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Contractor Companies')
@Controller('contractor-companies')
export class ContractorCompaniesController {
  constructor(private readonly service: ContractorCompaniesService) {}

  @ApiOperation({ summary: 'Adiciona uma empresa' })
  @ApiResponse({ status: 201, description: 'Empresa cadastrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Email ou CNPJ já em uso.' })
  @Post()
  async create(@Body() createDto: CreateContractorCompaniesDto) {
    try {
      const company = await this.service.create(createDto);
      const { password, ...result } = company;
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Empresa cadastrada com sucesso.',
        data: result,
      };
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status);
    }
  }

  @ApiOperation({ summary: 'Procura as empresas cadastradas' })
  @ApiQuery({ name: 'id', required: false, description: 'ID da empresa' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('id') id: number) {
    if (id) {
      return await this.service.findOne(id);
    }
    return await this.service.findAll();
  }

  @ApiOperation({ summary: 'Atualiza uma empresa contratante' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContractorCompaniesDto: CreateContractorCompaniesDto,
  ) {
    return await this.service.update(+id, updateContractorCompaniesDto);
  }

  @ApiOperation({ summary: 'Deleta uma empresa contratante' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID da Empresa Contratante',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa Contratante deletada com sucesso.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const message = await this.service.delete(+id);
    return { message };
  }
}
