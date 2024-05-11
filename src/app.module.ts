import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from './tenants/tenants.module';
import { TenancyModule } from './public/tenancy/tenancy.module';
import { UsersModule } from './tenanted/users/users.module';
import * as ormconfig from './public.orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TenantsModule,
    TenancyModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
