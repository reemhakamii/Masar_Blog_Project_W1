import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Post('signup')
  async signup(@Body() body) {
      const { userName, email, password } = body;
      const user = await this.usersService.findByEmail(email);
      if (user) {
        throw new BadRequestException('Email already taken');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await this.usersService.addNewUser({
        email,
        username: userName,
        password: hashedPassword,
      });
  
      return this.authService.login({ email, password });
  }
}