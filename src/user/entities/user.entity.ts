import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The UUID of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Column()
  name: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'The password of the user' })
  @Column()
  password: string;

  @ApiProperty({ example: '+123456789', description: 'The phone number of the user' })
  @Column()
  phoneNumber: string;

  @ApiProperty({ example: '1990-01-01', description: 'The birth date of the user' })
  @Column()
  birthDate: Date;
}
