import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';

export interface AbstractFind<T> {
  /**
   * Finds entities by options or returns empty array if nothing was found.
   * @param options
   * @param entityManager
   */
  findAll(
    options?: FindManyOptions<T>,
    entityManager?: EntityManager,
  ): Promise<T[]>;

  /**
   * Finds entities by options or returns empty array if nothing was found.
   * @param options
   * @param entityManager
   */
  findBy(
    where: FindOptionsWhere<T>,
    entityManager?: EntityManager,
  ): Promise<T[]>;

  /**
   * Finds one entity by options or throws an error if not found.
   * @param options
   * @param entityManager
   */
  findOne(
    options: FindOneOptions<T>,
    entityManager?: EntityManager,
  ): Promise<T>;

  /**
   * Finds one entity by options or throws an error if not found.
   * @param options
   * @param entityManager
   */
  findOneBy(
    where: FindOptionsWhere<T>,
    entityManager?: EntityManager,
  ): Promise<T>;

  /**
   * Finds one entity by options or throws an error if not found.
   * @param options
   * @param entityManager
   */
  findOneById(id: string, entityManager?: EntityManager): Promise<T>;

  /**
   * Finds one entity by options or throws an error if not found. Syntactic sugar for `findOneById`.
   * @param options
   * @param entityManager
   */
  findOneByIdOrFail(id: string, entityManager?: EntityManager): Promise<T>;

  /**
   * Finds one entity by options or returns null if not found.
   * @param id
   * @param entityManager
   */
  findOneByIdOrNull(
    id: string,
    entityManager?: EntityManager,
  ): Promise<T | null>;

  find(options: FindOneOptions<T>, entityManager?: EntityManager): Promise<T[]>;
}
