import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseDto } from 'server/models/responses.dto';
import { AuthService } from 'server/modules/auth/auth.service';
import { User } from 'server/database/schemas/users.schema';
import { UserDto } from 'server/models/user.dto';

@Controller({ version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('validate')
  @ApiOperation({ summary: 'Valida el usuario por email y password' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'token', type: ResponseDto<User> })
  async findByType(@Body() userDto: any): Promise<User> {
    const { email, password, secret } = userDto
    try {
      return this.authService.validate(email, password, secret);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Relanza la excepción HttpException (401 o 403)
      }
      // Manejo de otros errores inesperados
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('new')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'Nuevo usuario creado', type: ResponseDto<User> })
  async create(@Body() userDto: UserDto): Promise<User> {
    try {
      return this.authService.create(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Relanza la excepción HttpException (401 o 403)
      }
      // Manejo de otros errores inesperados
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'Usuario editado', type: ResponseDto<User> })
  async update(@Param('id') id: string, @Body() userDto: UserDto): Promise<User> {
    return this.authService.update(id, userDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario existente' })
  @ApiResponse({ status: 201, description: 'Status de eliminacion', type: ResponseDto<boolean> })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.authService.remove(id);
  }

}
