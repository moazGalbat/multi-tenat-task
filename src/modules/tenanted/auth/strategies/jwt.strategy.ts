import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { JwtDto } from '../dto/jwt.dto';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: JwtDto): Promise<User> {
    const contextId = ContextIdFactory.getByRequest(request);
    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
