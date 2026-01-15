import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, passwordHash, role: 'admin' });
    await this.usersRepo.save(user);

    return this.sign(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user.id, user.email, user.role);
  }

  private sign(id: string, email: string, role: string) {
    const access_token = this.jwt.sign({ sub: id, email, role });
    return { access_token };
  }
}
