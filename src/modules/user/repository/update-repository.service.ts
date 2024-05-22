import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../../common/abstract/abstract-repo-service';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FindRepositoryService } from './find-repository.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateRepositoryService extends AbstractRepository<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly findService: FindRepositoryService,
  ) {
    super(repository);
  }

  async updateOne(
    id: string,
    data: UpdateUserDto,
    entityManager?: EntityManager,
  ) {
    const manager = this.selectEntityManager(entityManager);

    const entity = await this.findService.findOneById(id, manager);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const merged = manager.merge(User, entity, data);

    try {
      const result = await manager.save(merged);

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
