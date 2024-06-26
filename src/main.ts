import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnection, getManager } from 'typeorm';
import { getTenantConnection } from './modules/tenancy/tenancy.utils';
import { tenancyMiddleware } from './modules/tenancy/tenancy.middleware';
import { ValidationPipe } from '@nestjs/common';
import { seedMainTenant, seedSuperAmin } from './seed';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(tenancyMiddleware);

  await getConnection().runMigrations();
  await seedMainTenant();
  const schemas = await getManager().query(
    'select schema_name as name from information_schema.schemata;',
  );

  for (let i = 0; i < schemas.length; i += 1) {
    const { name: schema } = schemas[i];

    if (schema.startsWith('tenant_')) {
      const tenantId = schema.replace('tenant_', '');
      const connection = await getTenantConnection(tenantId);
      await connection.runMigrations();
      await seedSuperAmin(connection, tenantId);
      await connection.close();
    }
  }
  await app.listen(3000);
}
bootstrap();
