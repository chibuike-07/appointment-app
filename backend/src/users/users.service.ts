import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(userData) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }
}