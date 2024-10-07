import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
    const user = this.userRepository.create({ email, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user; // 비밀번호가 맞을 경우 유저 반환
    }
    return null; // 유저가 없거나 비밀번호가 틀리면 null 반환
  }
}
