import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import * as tenantsOrmConfig from '../../tenants.orm.config';

import { DataSource } from 'typeorm';
const tenantConnections: { [key: string]: DataSource } = {};

export async function getTenantConnection(
  tenantId: string,
): Promise<DataSource> {
  const connectionName = `tenant_${tenantId}`;
  if (tenantConnections[connectionName]) {
    const existingConnection = tenantConnections[connectionName];
    if (existingConnection.isInitialized) {
      return existingConnection;
    } else {
      await existingConnection.initialize();
      return existingConnection;
    }
  }

  const tenantDataSource = new DataSource({
    ...(tenantsOrmConfig as PostgresConnectionOptions), // Ensure tenantsOrmConfig is imported correctly
    name: connectionName,
    schema: connectionName,
  });

  await tenantDataSource.initialize();
  return tenantDataSource;
}
