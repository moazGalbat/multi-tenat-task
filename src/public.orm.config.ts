import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'multi-tenant',
  logging: true,
  autoLoadEntities: true,
  entities: [join(__dirname, './modules/public/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/public/*{.ts,.js}')],
  // synchronize: true,
} as TypeOrmModuleOptions;
