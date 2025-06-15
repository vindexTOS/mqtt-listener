import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/jwt/jwt.strategy';
import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
   
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '30d' },
    }),
  ],
})
export class AuthModule {}
