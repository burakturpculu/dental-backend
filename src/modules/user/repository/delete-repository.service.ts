import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractDelete } from '../../../common/abstract/abstract-delete.interface';
import { AbstractRepository } from '../../../common/abstract/abstract-repo-service';
import { User } from '../entities/user.entity';
import { FindRepositoryService } from './find-repository.service';

@Injectable()
export class DeleteRepositoryService
  extends AbstractRepository<User>
  implements AbstractDelete<User>
{
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly findService: FindRepositoryService,
  ) {
    super(repository);
  }
  deleteMany(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyBy(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async removeOneById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<null> {
    try {
      const manager = this.selectEntityManager(entityManager);

      const entity = await this.findService.findOneById(id, manager);

      await manager.delete(User, entity);

      return null;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
