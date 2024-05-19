import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      if (!users.length) {
        throw new NotFoundException('Hiçbir kullanıcı bulunamadı');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Kullanıcıları getirirken bir hata oluştu');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Kullanıcıyı getirirken bir hata oluştu: ${error.message}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Email ve telefon numarası kontrolü
      const existingUserByEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
      if (existingUserByEmail) {
        throw new ConflictException('Bu e-posta zaten kullanılıyor');
      }
      
      const existingUserByPhone = await this.usersRepository.findOne({ where: { phoneNumber: createUserDto.phoneNumber } });
      if (existingUserByPhone) {
        throw new ConflictException('Bu telefon numarası zaten kullanılıyor');
      }

      // Şifre hashleme
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Kullanıcı oluşturulurken bir hata oluştu: ${error.message}`);
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı`);
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUserByEmail = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
        if (existingUserByEmail) {
          throw new ConflictException('Bu e-posta zaten kullanılıyor');
        }
      }

      if (updateUserDto.phoneNumber && updateUserDto.phoneNumber !== user.phoneNumber) {
        const existingUserByPhone = await this.usersRepository.findOne({ where: { phoneNumber: updateUserDto.phoneNumber } });
        if (existingUserByPhone) {
          throw new ConflictException('Bu telefon numarası zaten kullanılıyor');
        }
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      await this.usersRepository.update(id, updateUserDto);
      return this.usersRepository.findOneBy({ id });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Kullanıcı güncellenirken bir hata oluştu: ${error.message}`);
      }
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.usersRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Kullanıcı silinirken bir hata oluştu: ${error.message}`);
      }
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`Email adresi ${email} olan kullanıcı bulunamadı`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Kullanıcıyı getirirken bir hata oluştu: ${error.message}`);
    }
  }
}
