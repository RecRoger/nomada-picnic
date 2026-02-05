import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsOptional()
  @ApiProperty({ description: 'id del User', example: '' })
  _id?: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @ApiProperty({ description: 'Nombre' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'Nombre' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'contraseña' })
  password: string;
}
