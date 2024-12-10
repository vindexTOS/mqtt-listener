import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Auth } from './entities/auth.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


  constructor( 
    private readonly entityManager: EntityManager,  private readonly jwtService: JwtService) {

  }


  async Login(body: AuthDto) {
    try {
      const { username, password } = body
      const user = await this.entityManager.findOne(Auth,{ where: { username } })
      if (!user) throw new NotFoundException("User not found")

      if (user.password != password) throw new UnauthorizedException("Password is incorrect")

      const payload = {
        username: user.username,
        id: user.id,

      };

      return {
        token: this.jwtService.sign(payload),
      };

    } catch (error) {

    }
  }
}
