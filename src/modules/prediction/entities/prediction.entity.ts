import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.predictions)
  user: User;

  @Column('float')
  caries: number;

  @Column('float')
  gingivitis: number;

  @Column('float')
  ulcer: number;

  @Column()
  filePath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
