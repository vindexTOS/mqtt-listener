import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
 

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();

  try {
    const canActivate = (await super.canActivate(context)) as boolean;
 

    const user = request.user;
  

    if (!canActivate || !user) {
      throw new UnauthorizedException('User not authorized or token is invalid');
    }

    const userExists = await this.entityManager.findOne(Auth, {
      where: { id: user.id },
    });

    if (!userExists) {
      throw new UnauthorizedException('Wrong user');
    }

    return true;
  } catch (err) {
    console.error('JWT Guard Error:', err.message || err);
    throw new UnauthorizedException('Invalid token or user does not exist');
  }
}

}
