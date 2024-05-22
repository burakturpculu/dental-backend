import { EntityManager, FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface AbstractDelete<T> {
  /**
   * Soft deletes many entities by given conditions.
   * @param options
   * @param entityManager
   */
  deleteMany(
    options: FindManyOptions<T>,
    entityManager?: EntityManager,
  ): Promise<T[]>;

  /**
   * Soft deletes many entities by given conditions.
   * @param options
   * @param entityManager
   */
  deleteManyBy(
    options: FindOptionsWhere<T>,
    entityManager?: EntityManager,
  ): Promise<T[]>;

  /**
   * Soft deletes an entity by given id.
   * @param id
   * @param entityManager
   */
  removeOneById(id: string, entityManager?: EntityManager): Promise<T | null>;
}
