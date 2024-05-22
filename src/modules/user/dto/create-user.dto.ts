import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty({ message: 'İsim alanı boş bırakılamaz' })
  @IsString({ message: 'İsim alanı bir metin olmalıdır' })
  name: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'The password of the user',
  })
  @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz' })
  @IsString({ message: 'Şifre alanı bir metin olmalıdır' })
  password: string;

  @ApiProperty({
    example: '+123456789',
    description: 'The phone number of the user',
  })
  @IsNotEmpty({ message: 'Telefon numarası alanı boş bırakılamaz' })
  @IsString({ message: 'Geçerli bir telefon numarası girin' })
  phoneNumber: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the user',
  })
  @IsNotEmpty({ message: 'Doğum tarihi alanı boş bırakılamaz' })
  @IsDate({ message: 'Geçerli bir doğum tarihi girin' })
  @Type(() => Date)
  birthDate: Date;
}
