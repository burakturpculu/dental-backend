import { TestingModule, Test } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUser = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  password: 'hashedPassword',
  phoneNumber: '1234567890',
  birthDate: new Date(),
};

const mockUserService = {
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
