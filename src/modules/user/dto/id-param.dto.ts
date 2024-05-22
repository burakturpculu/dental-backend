import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The UUID of the user',
  })
  @IsUUID('4', { message: 'ID geçerli bir UUID olmalıdır' })
  @IsNotEmpty({ message: 'ID alanı boş bırakılamaz' })
  id: string;
}
