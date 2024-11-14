import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find();
  }
  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
  
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }


async addNewUser(createUserDto: CreateUserDto) {
  const { username, email, password } = createUserDto;

  const existingUser = await this.userRepository.findOne({ where: { email } });
  if (existingUser) {
      throw new UnauthorizedException('Email already in use');
  }

  const user = new User();
  user.username = username;
  user.email = email;
  user.password = await bcrypt.hash(password, 10);

  return await this.userRepository.save(user);
}

async updateUser(updateUserDto: UpdateUserDto, id: string) {
  if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }
  await this.userRepository.update(id, updateUserDto);
  return await this.userRepository.findOneBy({ id });
}

  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }

async login(email: string, password: string): Promise<{ token: string }> {
  console.log('Login Attempt:', { email, password });
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  console.log('User found:', user);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);


  const payload: JwtPayload = { id: user.id, username: user.username };
  const token = this.jwtService.sign(payload);

  return { token };
}
async rehashPlainPasswords() {
  const users = await this.userRepository.find();

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) { 
      const hashedPassword = await bcrypt.hash(user.password, 10); 
      user.password = hashedPassword;
      await this.userRepository.save(user);
    }
  }

  return { message: 'Rehashed all plain text passwords.' };
}

  async validateUserByJwt(payload: JwtPayload): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}