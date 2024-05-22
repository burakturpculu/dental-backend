import { EntityManager } from 'typeorm';

export interface AbstractCreate<TEntity> {
  create(data: any, entityManager?: EntityManager): Promise<TEntity>;
  createMany(data: any, entityManager?: EntityManager): Promise<TEntity[]>;
}
