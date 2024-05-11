import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'multi-tenant',
  logging: true,
  autoLoadEntities: true,
  entities: [join(__dirname, './modules/public/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/public/*{.ts,.js}')],
  // synchronize: true,
} as TypeOrmModuleOptions;
