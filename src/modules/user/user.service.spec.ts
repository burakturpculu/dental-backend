import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

const mockUser = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  password: 'hashedPassword',
  phoneNumber: '1234567890',
  birthDate: new Date(),
};

const mockUserRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});