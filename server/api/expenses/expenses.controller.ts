import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseDto } from 'server/models/responses.dto';
import { CostDto } from 'server/models/cost.dto';
import { ResponseInterceptor } from 'server/interceptors/response.interceptor';
import { Expense } from 'server/database/schemas/expenses.schema';

@Controller({ version: '1' })
@ApiTags('Expenses')
@UseInterceptors(ResponseInterceptor)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Get('list')
  @ApiOperation({ summary: 'Obtener Lista de Gastos' })
  @ApiResponse({ status: 201, description: 'Lista de gastos', type: ResponseDto<Expense[]> })
  async findAll(): Promise<Expense[]> {
    return this.expensesService.findAll();
  }

  @Get('')
  @ApiOperation({ summary: 'Obtener valor de Gasto total' })
  @ApiResponse({ status: 201, description: 'Objeto de gastos', type: ResponseDto<any> })
  async getExpenses(
    @Query('guests') guestsAmount: string,
    @Query('percentage') percentage: string,
  ): Promise<any> {
    console.log({ guestsAmount, percentage })
    return this.expensesService.getExpenses(Number(guestsAmount), Number(percentage));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un gasto' })
  @ApiBody({ type: CostDto })
  @ApiResponse({ status: 201, description: 'Nuevo gasto creado', type: ResponseDto<Expense> })
  async create(
    @Body() createCost: CostDto
  ): Promise<Expense> {
    return this.expensesService.create(createCost);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un Gasto' })
  @ApiBody({ type: CostDto })
  @ApiResponse({ status: 201, description: 'Gasto editado', type: ResponseDto<CostDto> })
  async update(
    @Param('id') id: string,
    @Body() updateCost: CostDto,
  ): Promise<Expense> {
    return this.expensesService.update(id, updateCost);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.expensesService.remove(id);
  }

}
