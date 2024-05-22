import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainService } from './domain/domain.service';
import { User } from './entities/user.entity';
import { CreateRepositoryService } from './repository/create-repository.service';
import { DeleteRepositoryService } from './repository/delete-repository.service';
import { FindRepositoryService } from './repository/find-repository.service';
import { UpdateRepositoryService } from './repository/update-repository.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    DomainService,
    FindRepositoryService,
    CreateRepositoryService,
    UpdateRepositoryService,
    DeleteRepositoryService,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    DomainService,
    FindRepositoryService,
    CreateRepositoryService,
    UpdateRepositoryService,
    DeleteRepositoryService,
  ],
})
export class UserModule {}
