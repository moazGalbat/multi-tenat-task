import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.entity';
import { Authorize } from 'src/modules/tenanted/auth/guards/authorize.guard';

@Resolver('Tenant')
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Authorize()
  @Mutation(() => Tenant)
  async createTenant(
    @Args('createTenantInput') createTenantDto: CreateTenantDto,
    @Context() context,
  ): Promise<Tenant> {
    return this.tenantsService.create(createTenantDto, context.req.user);
  }

  @Query(() => [Tenant])
  async tenants(): Promise<Tenant[]> {
    return this.tenantsService.findAll();
  }
}
