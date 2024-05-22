import { AbstractRepository } from 'src/common/abstract/abstract-repo-service';
import { Prediction } from '../entities/prediction.entity';
import { AbstractCreate } from 'src/common/abstract/abstract-create.interface';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePredictionDto } from '../dto/create-prediction.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CreateRepositoryService
  extends AbstractRepository<Prediction>
  implements AbstractCreate<Prediction>
{
  constructor(
    @InjectRepository(Prediction) repository: Repository<Prediction>,
    private readonly userService: UserService,
  ) {
    super(repository);
  }
  createMany(): Promise<Prediction[]> {
    throw new Error('Method not implemented.');
  }

  async create(
    data: CreatePredictionDto,
    entityManager?: EntityManager,
  ): Promise<Prediction> {
    const manager = this.selectEntityManager(entityManager);

    const user = await this.userService.findOne(data.userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const entity = new Prediction();
    entity.user = user;
    entity.caries = data.predictionResult.caries;
    entity.gingivitis = data.predictionResult.gingivitis;
    entity.ulcer = data.predictionResult.ulcer;
    entity.filePath = data.filePath;

    try {
      const result = await manager.save(Prediction, entity);

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
