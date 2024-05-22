import { AbstractFind } from 'src/common/abstract/abstract-find.interface';
import { AbstractOptionalFind } from 'src/common/abstract/abstract-optional-find.interface';
import { AbstractRepository } from 'src/common/abstract/abstract-repo-service';
import { User } from '../entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class FindRepositoryService
  extends AbstractRepository<User>
  implements AbstractFind<User>, AbstractOptionalFind<User>
{
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
  find(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async findOne(
    options: FindOneOptions<User>,
    entityManager?: EntityManager,
  ): Promise<User> {
    const manager = this.selectEntityManager(entityManager);

    const entity = await manager.findOne(User, options);

    return entity;
  }
  findOneByOrNull(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
  ): Promise<User> {
    return this.findOneOrNull({ where }, entityManager);
  }

  findOneById(id: string, entityManager?: EntityManager): Promise<User> {
    return this.findOneBy({ id }, entityManager);
  }

  findOneByIdOrFail(id: string, entityManager?: EntityManager): Promise<User> {
    return this.findOneByFail({ id }, entityManager);
  }

  findOneByIdOrNull(id: string, entityManager?: EntityManager): Promise<User> {
    return this.findOneByFail({ id }, entityManager);
  }

  async findAll(
    options?: FindManyOptions<User>,
    entityManager?: EntityManager,
  ) {
    const manager = this.selectEntityManager(entityManager);

    return manager.find(User, options);
  }

  async findOneFail(
    options: FindOneOptions<User>,
    entityManager?: EntityManager,
  ): Promise<User> {
    const manager = this.selectEntityManager(entityManager);

    const entity = await manager.findOne(User, options);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  findOneByFail(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
  ): Promise<User> {
    return this.findOneFail({ where }, entityManager);
  }

  findOneBy(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
  ): Promise<User> {
    return this.findOne({ where }, entityManager);
  }

  async findOneOrNull(
    options: FindOneOptions<User>,
    entityManager?: EntityManager,
  ): Promise<User | null> {
    const manager = this.selectEntityManager(entityManager);

    return manager.findOne(User, options);
  }

  async findBy(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
  ): Promise<User[]> {
    const manager = this.selectEntityManager(entityManager);

    return manager.findBy(User, where);
  }

  async findByFail(
    where: FindOptionsWhere<User>,
    entityManager?: EntityManager,
  ): Promise<User[]> {
    const manager = this.selectEntityManager(entityManager);

    const entity = await manager.findOneBy(User, where);

    if (!entity) {
      throw new NotFoundException();
    }

    return manager.findBy(User, where);
  }
}
