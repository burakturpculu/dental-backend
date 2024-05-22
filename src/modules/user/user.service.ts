import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DomainService } from './domain/domain.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly domainService: DomainService) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.domainService.findRepositoryService.findAll();
      if (!users.length) {
        throw new NotFoundException('Hiçbir kullanıcı bulunamadı');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Kullanıcıları getirirken bir hata oluştu',
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user =
        await this.domainService.findRepositoryService.findOneById(id);
      if (!user) {
        throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Kullanıcıyı getirirken bir hata oluştu: ${error.message}`,
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Email ve telefon numarası kontrolü
      const existingUserByEmail =
        await this.domainService.findRepositoryService.findOneBy({
          email: createUserDto.email,
        });
      if (existingUserByEmail) {
        throw new ConflictException('Bu e-posta zaten kullanılıyor');
      }

      const existingUserByPhone =
        await this.domainService.findRepositoryService.findOneBy({
          phoneNumber: createUserDto.phoneNumber,
        });
      if (existingUserByPhone) {
        throw new ConflictException('Bu telefon numarası zaten kullanılıyor');
      }

      return this.domainService.createRepositoryService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Kullanıcı oluşturulurken bir hata oluştu: ${error.message}`,
        );
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user =
        await this.domainService.findRepositoryService.findOneById(id);

      if (!user) {
        throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı`);
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUserByEmail =
          await this.domainService.findRepositoryService.findOneBy({
            email: updateUserDto.email,
          });
        if (existingUserByEmail) {
          throw new ConflictException('Bu e-posta zaten kullanılıyor');
        }
      }

      if (
        updateUserDto.phoneNumber &&
        updateUserDto.phoneNumber !== user.phoneNumber
      ) {
        const existingUserByPhone =
          await this.domainService.findRepositoryService.findOneBy({
            phoneNumber: updateUserDto.phoneNumber,
          });
        if (existingUserByPhone) {
          throw new ConflictException('Bu telefon numarası zaten kullanılıyor');
        }
      }

      return this.domainService.updateRepositoryService.updateOne(
        id,
        updateUserDto,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Kullanıcı güncellenirken bir hata oluştu: ${error.message}`,
        );
      }
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.domainService.deleteRepositoryService.removeOneById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Kullanıcı silinirken bir hata oluştu: ${error.message}`,
        );
      }
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.domainService.findRepositoryService.findOneBy({
        email,
      });
      if (!user) {
        throw new NotFoundException(
          `Email adresi ${email} olan kullanıcı bulunamadı`,
        );
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Kullanıcıyı getirirken bir hata oluştu: ${error.message}`,
      );
    }
  }
}
