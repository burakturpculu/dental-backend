import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { Prediction } from './entities/prediction.entity';
import { UserModule } from '../user/user.module';
import { DomainService } from './domain/domain.service';
import { CreateRepositoryService } from './repository/create-repository.service';
import { FindRepositoryService } from './repository/find-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction]), UserModule],
  providers: [
    PredictionService,
    DomainService,
    FindRepositoryService,
    CreateRepositoryService,
  ],
  controllers: [PredictionController],
  exports: [
    PredictionService,
    DomainService,
    FindRepositoryService,
    CreateRepositoryService,
  ],
})
export class PredictionModule {}
