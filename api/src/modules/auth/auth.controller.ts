import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserDto } from 'src/common/models/user.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('validate')
  @ApiOperation({ summary: 'Valida el usuario por email y password' })
  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: 201, description: 'token', schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(UserDto),
        },
      },
    },
  })
  async findByType(@Body() userDto: any): Promise<UserDto> {
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
  @ApiResponse({
    status: 201, description: 'Nuevo usuario creado', schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(UserDto),
        },
      },
    },
  })
  async create(@Body() userDto: UserDto): Promise<UserDto> {
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
  @ApiQuery({ name: 'id', required: true })
  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: 201, description: 'Usuario editado', schema: {
      properties: {
        status: { type: 'string', example: 'SUCCESS' },
        message: { type: 'string', example: 'Operación exitosa' },
        data: {
          $ref: getSchemaPath(UserDto),
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() userDto: UserDto): Promise<UserDto> {
    return this.authService.update(id, userDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario existente' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({
    status: 201, description: 'Status de eliminacion', schema: {
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
    return this.authService.remove(id);
  }

}
