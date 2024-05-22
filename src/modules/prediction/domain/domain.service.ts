import { Injectable, Logger } from '@nestjs/common';

import { FindRepositoryService } from '../repository/find-repository.service';
import { CreateRepositoryService } from '../repository/create-repository.service';

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);
  constructor(
    public readonly findRepositoryService: FindRepositoryService,
    public readonly createRepositoryService: CreateRepositoryService,
  ) {}
}
