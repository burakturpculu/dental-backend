import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractOptionalFind } from '../../../common/abstract/abstract-optional-find.interface';
import { Prediction } from '../entities/prediction.entity';

import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AbstractFind } from '../../../common/abstract/abstract-find.interface';
import { AbstractRepository } from '../../../common/abstract/abstract-repo-service';

@Injectable()
export class FindRepositoryService
  extends AbstractRepository<Prediction>
  implements AbstractFind<Prediction>, AbstractOptionalFind<Prediction>
{
  constructor(
    @InjectRepository(Prediction) repository: Repository<Prediction>,
  ) {
    super(repository);
  }
  findOne(
    options: FindOneOptions<Prediction>,
    entityManager?: EntityManager | undefined,
  ): Promise<Prediction> {
    throw new Error('Method not implemented.');
  }
  find(
    options: FindOneOptions<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction[]> {
    const manager = this.selectEntityManager(entityManager);

    const entity = manager.find(Prediction, options);

    return entity;
  }

  findOneByOrNull(
    where: FindOptionsWhere<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction | null> {
    return this.findOneOrNull({ where }, entityManager);
  }

  findOneById(id: string, entityManager?: EntityManager): Promise<Prediction> {
    return this.findOneBy({ id }, entityManager);
  }

  findOneByIdOrFail(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    return this.findOneByFail({ id }, entityManager);
  }

  findOneByIdOrNull(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    return this.findOneByFail({ id }, entityManager);
  }

  async findAll(
    options?: FindManyOptions<Prediction>,
    entityManager?: EntityManager,
  ) {
    const manager = this.selectEntityManager(entityManager);

    return manager.find(Prediction, options);
  }

  async findOneFail(
    options: FindOneOptions<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    const manager = this.selectEntityManager(entityManager);

    const entity = await manager.findOne(Prediction, options);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  findOneByFail(
    where: FindOptionsWhere<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    return this.findOneFail({ where }, entityManager);
  }

  findOneBy(
    where: FindOptionsWhere<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    return this.findOne({ where }, entityManager);
  }

  async findOneOrNull(
    options: FindOneOptions<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction | null> {
    const manager = this.selectEntityManager(entityManager);

    return manager.findOne(Prediction, options);
  }

  async findBy(
    where: FindOptionsWhere<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction[]> {
    const manager = this.selectEntityManager(entityManager);

    return manager.findBy(Prediction, where);
  }

  async findByFail(
    where: FindOptionsWhere<Prediction>,
    entityManager?: EntityManager,
  ): Promise<Prediction[]> {
    const manager = this.selectEntityManager(entityManager);

    const entity = await manager.findOneBy(Prediction, where);

    if (!entity) {
      throw new NotFoundException();
    }

    return manager.findBy(Prediction, where);
  }
}
