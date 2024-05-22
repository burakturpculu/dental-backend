import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
  async signin(signinDto: SigninDto) {
    const user = await this.validateUser(signinDto.email, signinDto.password);
    if (!user) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
      },
    };
  }
}
