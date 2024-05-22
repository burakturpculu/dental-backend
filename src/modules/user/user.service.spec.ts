import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { DomainService } from './domain/domain.service';
import { FindRepositoryService } from './repository/find-repository.service';
import { CreateRepositoryService } from './repository/create-repository.service';
import { UpdateRepositoryService } from './repository/update-repository.service';
import { DeleteRepositoryService } from './repository/delete-repository.service';

const mockUserRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainService,
        FindRepositoryService,
        CreateRepositoryService,
        UpdateRepositoryService,
        DeleteRepositoryService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
