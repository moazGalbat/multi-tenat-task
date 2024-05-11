import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';
import { TenantsResolver } from './tenants.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantsService, TenantsResolver],
  controllers: [],
})
export class TenantsModule {}
