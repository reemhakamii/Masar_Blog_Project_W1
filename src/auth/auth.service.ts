import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Login Attempt:', { email });

    const user = await this.usersService.findByEmail(email);

    if (!user) {
        throw new BadRequestException('User not found');
    }

    console.log('User found:', user);

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    console.log('Password match:', isPasswordMatch);

    if (isPasswordMatch) {
        const { password, ...result } = user;
        return result;
    }

    throw new UnauthorizedException('Invalid login credentials');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async login(user: any) {
    const payload: JwtPayload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}