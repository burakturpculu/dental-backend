import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

jest.setTimeout(240_000);
describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {});

  it('should User has been successfully created.', async () => {
    const birthDate = dayjs().toDate();
    const mockedResponse: User = {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'StrongPassword123',
      phoneNumber: '+123456789',
      birthDate,
      id: '',
      predictions: [],
    };
    const mockCreateUserDto: CreateUserDto = {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'StrongPassword123',
      phoneNumber: '+123456789',
      birthDate,
    };

    jest.spyOn(service, 'create').mockResolvedValue(mockedResponse);

    const response = await controller.create(mockCreateUserDto);
    expect(controller).toBeDefined();
    expect(response).toEqual(mockedResponse);
  });

  it('should User has been fail created.', async () => {
    const birthDate = dayjs().toDate();
    jest
      .spyOn(service, 'create')
      .mockRejectedValueOnce(new Error('User creation failed'));

    const createUserDto = {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '',
      birthDate,
    };

    await expect(service.create(createUserDto)).rejects.toThrow(
      new InternalServerErrorException('User creation failed'),
    );
  });

  it('should User has been successfully created.', async () => {
    const birthDate = dayjs().toDate();
    const mockedResponse: User = {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'StrongPassword123',
      phoneNumber: '+123456789',
      birthDate,
      id: '',
      predictions: [],
    };
    const mockCreateUserDto: CreateUserDto = {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'StrongPassword123',
      phoneNumber: '+123456789',
      birthDate,
    };

    jest.spyOn(service, 'findAll').mockResolvedValue(mockedResponse);

    const response = await controller.create(mockCreateUserDto);
    expect(controller).toBeDefined();
    expect(response).toEqual(mockedResponse);
  });
});
