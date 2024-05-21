import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Prediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    caries: number;

    @Column()
    gingivitis: number;

    @Column()
    ulcer: number;

    @Column()
    filePath: string;

    @ManyToOne(() => User, user => user.predictions)
    user: User;

    @Column()
    userId: string;
}
