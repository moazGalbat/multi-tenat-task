import { Connection, getManager } from 'typeorm';
import { Tenant } from './modules/public/tenants/tenant.entity';
import { User } from './modules/tenanted/users/user.entity';
import { Role } from './modules/tenanted/auth/role.enum';
import { hash } from 'bcrypt';

export const seedMainTenant = async () => {
  const mainTenantId = process.env.MAIN_TENANT_ID;
  const mainTenant = new Tenant();
  mainTenant.id = mainTenantId;
  mainTenant.name = 'main';
  await getManager().save(mainTenant);
  const schemaName = `tenant_${mainTenantId}`;
  await getManager().query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
};

export const seedSuperAmin = async (
  connection: Connection,
  tenantId: string,
) => {
  const mainTenantId = process.env.MAIN_TENANT_ID;
  const password = await hash(process.env.ADMIN_PASSWORD, 10);
  if (tenantId === mainTenantId) {
    await connection.getRepository(User).upsert(
      {
        name: 'admin',
        email: 'admin@admin.com',
        password: password,
        role: Role.ADMIN,
      },
      ['email'],
    );
  }
};
