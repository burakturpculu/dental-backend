import { AbstractRepository } from '../../../common/abstract/abstract-repo-service';
import { User } from '../entities/user.entity';
import { AbstractCreate } from '../../../common/abstract/abstract-create.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateRepositoryService
  extends AbstractRepository<User>
  implements AbstractCreate<User>
{
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
  createMany(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async create(
    data: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const manager = this.selectEntityManager(entityManager);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const entity = manager.create(User, {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate,
    });

    try {
      const result = await manager.save(User, entity);

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
