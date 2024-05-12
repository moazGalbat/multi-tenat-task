import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { RolesGuard } from './role.guard';
import { Role } from '../role.enum';

export const Authorize = (...roles: Role[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, RolesGuard),
  );
