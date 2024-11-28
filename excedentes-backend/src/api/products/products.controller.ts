import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  Put,
  HttpStatus,
  Request,
  UseInterceptors,
  Inject,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './domain/products.service';
import { CreateProductDto } from './dto/createProductDto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/request';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Produtos')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductsService)
    private readonly productService: ProductsService,
  ) {}

  @Get('/mine')
  @ApiOperation({ summary: 'Listagem de produtos por empresa' })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Produtos da empresa encontrados',
    type: Array<CreateProductDto>,
  })
  @ApiBearerAuth()
  async getList(
    @Request() req: AuthenticatedRequest,
  ): Promise<CreateProductDto[]> {
    return this.productService.findAllActiveByCompany(req.user.sub, false);
  }

  @ApiOperation({ summary: 'Filtra os produtos da empresa por nome' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'Nome do Produto',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Produtos da empresa encontrados',
    type: Array<CreateProductDto>,
  })
  @Get('mine/:name')
  async findProductByName(
    @Request() req: AuthenticatedRequest,
    @Param('name') name: string,
  ) {
    return await this.productService.findByName(req.user.sub, name);
  }

  @ApiOperation({ summary: 'Encontrar produtos próximos a um raio' })
  @ApiResponse({ status: 200, description: 'Produtos encontrados' })
  @ApiResponse({ status: 400, description: 'Erro ao encontrar produtos' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/location')
  async findByLocation(
    @Req() req: AuthenticatedRequest,
    @Query('clientLatitude') clientLatitude: string,
    @Query('clientLongitude') clientLongitude: string,
    @Query('clientRadius') clientRadius: string,
  ) {
    try {
      const products = await this.productService.findByLocation(
        req.user,
        +clientLatitude,
        +clientLongitude,
        +clientRadius,
      );

      return products;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @ApiOperation({ summary: 'Adiciona uma produto' })
  @ApiResponse({ status: 201, description: 'Produto adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao adicionar produto' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('product_image'))
  @Post()
  async create(
    @Body() product: CreateProductDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      const newProduct = await this.productService.create(
        product,
        req.user.sub,
      );
      return {
        message: 'Produto adicionado com sucesso!',
        product: newProduct,
        statusCode: HttpStatus.CREATED,
      };
    } catch (HttpException) {
      throw new HttpException(
        { message: HttpException.message },
        HttpException.status,
      );
    }
  }

  @ApiOperation({ summary: 'Atualiza uma produto' })
  @ApiResponse({ status: 200, description: 'Produto editado com sucesso' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID do Produto',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() product: CreateProductDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      const updatedProduct = await this.productService.update(
        +id,
        product,
        req.user.sub,
      );
      return {
        message: 'Produto atualizado com sucesso!',
        product: updatedProduct,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status);
    }
  }

  @ApiOperation({ summary: 'Procura todos os produtos' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Procura um produto por id' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID do Produto',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Marca um produto como deletado' })
  @ApiResponse({
    status: 200,
    description: 'Produto marcado como deletado com sucesso',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID do Produto',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }

  @ApiOperation({ summary: 'Remove um produto do estoque' })
  @Delete('mine/:id')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID do Produto',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async removeProduct(@Param('id') id: number) {
    const result = await this.productService.remove(id);
    if (!result) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Produto removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }
}
