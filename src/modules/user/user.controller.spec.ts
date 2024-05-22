import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { CreateUserDto } from './dto/create-user.dto';
import { IdParamDto } from './dto/id-param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
            remove: jest.fn().mockImplementation((id: string) => {
              if (id === '123e4567-e89b-12d3-a456-426614174000') {
                return Promise.resolve(true);
              } else {
                return Promise.resolve(false);
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {});
  it('should define controller', async () => {
    expect(controller).toBeDefined();
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

  it('should return findAll User', async () => {
    const birthDate = dayjs().toDate();

    const mockUser: User[] = [
      {
        id: 'e1a69e05-b3dc-4036-9065-2c6581c87628',
        email: 'user@example.com',
        name: 'John Doe',
        password:
          '$2b$10$eEYtGK.Slttx/d3Ua4nDn.dfnViWSguz22QzdNbc5VKsmXTpX106W',
        phoneNumber: '+123456789',
        birthDate,
        predictions: [],
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(mockUser);

    const response = await controller.findAll();
    expect(response).toEqual(mockUser);
  });

  it('should return User when given a valid UserId ', async () => {
    const birthDate = dayjs().toDate();
    const mockUser: IdParamDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const mockResponseUser: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'John Doe',
      password: '$2b$10$eEYtGK.Slttx/d3Ua4nDn.dfnViWSguz22QzdNbc5VKsmXTpX106W',
      phoneNumber: '+123456789',
      birthDate,
      predictions: [],
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(mockResponseUser);
    const response = await controller.findOne(mockUser);
    expect(response).toEqual(mockResponseUser);
  });

  it('should update User when given a valid UserId ', async () => {
    const birthDate = dayjs().toDate();
    const mockId: IdParamDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const mockUser: UpdateUserDto = {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'StrongPassword123',
      phoneNumber: '+123456789',
      birthDate,
    };
    jest.spyOn(service, 'update').mockResolvedValue(mockUser);
    const response = await controller.update(mockId, mockUser);
    expect(response).toEqual(mockUser);
  });

  it('should remove User when given a valid UserId ', async () => {
    const mockId: IdParamDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    await expect(controller.remove(mockId)).resolves.toBe(true);
  });
});
