import { EntityManager, FindOneOptions, FindOptionsWhere } from 'typeorm';

export interface AbstractOptionalFind<Entity> {
  findOneOrNull(
    options: FindOneOptions<Entity>,
    entityManager?: EntityManager | undefined,
  ): Promise<Entity | null>;
  findOneByOrNull(
    where: FindOptionsWhere<Entity>,
    entityManager?: EntityManager | undefined,
  ): Promise<Entity | null>;
  findOneByIdOrNull(
    id: string,
    entityManager?: EntityManager | undefined,
  ): Promise<Entity | null>;
}
