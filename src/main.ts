import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getTenantConnection } from './modules/tenancy/tenancy.utils';
import { tenancyMiddleware } from './modules/tenancy/tenancy.middleware';
import { ValidationPipe } from '@nestjs/common';
import { seedMainTenant, seedSuperAmin } from './seed';
import { AppDataSource } from './datasource';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(tenancyMiddleware);

  const mainDataSource = await AppDataSource.initialize(); // Initialize the main DataSource
  await AppDataSource.runMigrations(); // Run migrations on the main DataSource
  await seedMainTenant(mainDataSource);
  const schemas = await AppDataSource.query(
    'SELECT schema_name as name FROM information_schema.schemata;',
  );

  for (let i = 0; i < schemas.length; i += 1) {
    const { name: schema } = schemas[i];

    if (schema.startsWith('tenant_')) {
      const tenantId = schema.replace('tenant_', '');
      const connection = await getTenantConnection(tenantId);
      await connection.runMigrations();
      await seedSuperAmin(connection, tenantId);
      await connection.destroy();
    }
  }
  await app.listen(5001);
}
bootstrap();
