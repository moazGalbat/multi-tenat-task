import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from '../../tenancy/tenancy.utils';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.entity';
import { User } from 'src/modules/tenanted/users/user.entity';
import { Role } from 'src/modules/tenanted/auth/role.enum';
import { AppDataSource } from 'src/datasource';
@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto, user: User): Promise<Tenant> {
    let tenant = new Tenant();
    tenant.name = createTenantDto.name;

    tenant = await this.tenantsRepository.save(tenant);

    const schemaName = `tenant_${tenant.id}`;
    await AppDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const connection = await getTenantConnection(`${tenant.id}`);
    await connection.runMigrations();
    await connection.getRepository(User).save({ ...user, role: Role.ADMIN });
    await connection.destroy();

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }
}
