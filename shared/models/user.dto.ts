// import { ApiProperty } from '@nestjs/swagger';

export interface UserDto {
  // @ApiProperty({ description: 'id del User' })
  _id?: string;

  // @ApiProperty({ description: 'Nombre' })
  name: string;

  // @ApiProperty({ description: 'Nombre' })
  email: string;

  // @ApiProperty({ description: 'contraseña' })
  password: string
}