import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { JwtDto } from '../dto/jwt.dto';
import { Request } from 'express';
import { getTenantConnection } from 'src/modules/tenancy/tenancy.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: JwtDto): Promise<User> {
    if (!request.tenantId) {
      throw new UnauthorizedException();
    }
    const connection = await getTenantConnection(request.tenantId);
    const userRepo = connection.getRepository(User);
    const user = await userRepo.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
