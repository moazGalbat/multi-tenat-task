import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SecurityConfig } from 'src/config/config.interface';
import { SignupInput } from './dto/singup.input';
import { AccessToken } from './dto/access-token.dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CONNECTION } from 'src/modules/tenancy/tenancy.symbols';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    @Inject(CONNECTION) connection: Connection,
  ) {
    this.userRepository = connection.getRepository(User);
  }

  async signup(payload: SignupInput): Promise<AccessToken> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    try {
      const user = this.userRepository.create({
        ...payload,
        password: hashedPassword,
        role: 'USER',
      });
      await this.userRepository.save(user);

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(payload: LoginInput): Promise<AccessToken> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordValid = await this.passwordService.validatePassword(
      payload.password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException();
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.userRepository.findOne({ where: { id } });
  }

  generateTokens(payload: { userId: string }): AccessToken {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
