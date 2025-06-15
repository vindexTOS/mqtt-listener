import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Auth } from './entities/auth.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const user = await this.entityManager.find(Auth);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
 
    if (user.length === 0) {
      const newAdmin = this.entityManager.create(Auth, {
        username: adminUser,
        password: hashedPassword,
      });
      await this.entityManager.save(Auth, newAdmin);
    }
  }

  async Login(body: AuthDto) {
    try {
      const { username, password } = body;
      const user = await this.entityManager.findOne(Auth, {
        where: { username },
      });
      if (!user) throw new NotFoundException('User not found');

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch)
        throw new UnauthorizedException('Password is incorrect');

      const payload = {
        username: user.username,
        id: user.id,
      };

      return {
     token: this.jwtService.sign(payload, {
  expiresIn: '7d',
  secret: process.env.JWT_SECRET,
})
      };
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throw new UnauthorizedException(error.message);
      else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else throw new InternalServerErrorException(error.message);
    }
  }
}
