import { Prediction } from '../../prediction/entities/prediction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  birthDate: Date;

  @OneToMany(() => Prediction, (prediction) => prediction.user)
  predictions: Prediction[];

  constructor(
    email: string,
    name: string,
    password: string,
    phoneNumber: string,
    birthDate: Date,
  ) {
    this.id = uuidv4();
    this.email = email;
    this.name = name;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
  }
}
