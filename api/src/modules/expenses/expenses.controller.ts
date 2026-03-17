import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ExpenseDto, ExpenseValueDto } from 'src/common/models/expense.dto';
import { ParseNumberInterceptor } from 'src/common/interceptors/parse-number.interceptor';


@Controller({ path: 'expenses', version: '1' })
@ApiTags('Expenses')
@UseInterceptors(ResponseInterceptor)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Get('list')
  @ApiOperation({ summary: 'Obtener Lista de Gastos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gastos',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ExpenseDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  async findAll(): Promise<ExpenseDto[]> {
    return this.expensesService.findAll();
  }

  @Get('')
  @ApiOperation({ summary: 'Obtener valor de Gasto total' })
  @ApiQuery({ name: 'guests', required: false, example: 6 })
  @ApiQuery({ name: 'percentage', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Valores de gastos',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'object',
          items: { $ref: getSchemaPath(ExpenseValueDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  async getExpenses(
    @Query('guests') guestsAmount: string,
    @Query('percentage') percentage: string,
  ): Promise<ExpenseValueDto> {
    return this.expensesService.getExpenses(Number(guestsAmount), Number(percentage));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un gasto' })
  @ApiBody({ type: ExpenseDto })
  @ApiResponse({
    status: 200,
    description: 'Gasto creado correctamente',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'object',
          items: { $ref: getSchemaPath(ExpenseDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  @UseInterceptors(
    new ParseNumberInterceptor(['cost']),
  )
  async create(
    @Body() createCost: ExpenseDto
  ): Promise<ExpenseDto> {
    return this.expensesService.create(createCost);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un Gasto' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: ExpenseDto })
  @ApiResponse({
    status: 200,
    description: 'Gasto editado correctamente',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'object',
          items: { $ref: getSchemaPath(ExpenseDto) }, // Si usas la clase del Schema
        },
      },
    },
  })
  @UseInterceptors(
    new ParseNumberInterceptor(['cost']),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCost: ExpenseDto,
  ): Promise<ExpenseDto> {
    return this.expensesService.update(id, updateCost);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Gasto eliminado',
    schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          type: 'boolean',
        },
      },
    },
  })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.expensesService.remove(id);
  }

}
