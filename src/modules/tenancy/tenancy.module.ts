import { Global, Module, Scope } from '@nestjs/common';
import { CONNECTION } from './tenancy.symbols';
import { Request as ExpressRequest } from 'express';
import { getTenantConnection } from './tenancy.utils';
import { REQUEST } from '@nestjs/core';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: ExpressRequest) => {
    const { tenantId } = request;

    if (tenantId) {
      return getTenantConnection(tenantId);
    }

    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class TenancyModule {}
