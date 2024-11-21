import { User } from '../entities/user.entity';
export class UserDto {
id: string;
username: string;
email: string;


  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}
