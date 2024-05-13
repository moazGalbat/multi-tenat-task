### Repository Structure

This repository organizes the application into functional modules, distinguishing between public and tenanted functionalities for clarity.

- **Public Module**: Contains the public tenants table.
- **Tenanted Module**: Holds all tenanted functionalities, such as users in this project.

### Folder Structure

```
└── 📁multi-tenant-task
    └── .env
    └── Dockerfile
    └── docker-compose.yaml
    └── package-lock.json
    └── package.json
    └── 📁src
        └── abstract.entity.ts
        └── app.module.ts
        └── main.ts
        └── 📁migrations
            └── 📁public
                └── 1638963391898-AddTenants.ts
            └── 📁tenanted
                └── 1638963474130-AddUsers.ts
        └── 📁modules
            └── 📁public
                └── 📁tenants
                    └── 📁dto
                        └── create-tenant.dto.ts
                    └── tenant.entity.ts
                    └── tenants.module.ts
                    └── tenants.resolvers.ts
                    └── tenants.service.ts
            └── 📁tenancy
                └── tenancy.middleware.ts
                └── tenancy.module.ts
                └── tenancy.symbols.ts
                └── tenancy.utils.ts
            └── 📁tenanted
                └── 📁auth
                    └── auth.module.ts
                    └── auth.resolvers.ts
                    └── auth.service.ts
                    └── 📁dto
                        └── access-token.dto.ts
                        └── jwt.dto.ts
                        └── login.input.ts
                        └── refresh-token.args.ts
                        └── singup.input.ts
                    └── 📁guards
                        └── authorize.guard.ts
                        └── gql-auth.guard.ts
                        └── role.guard.ts
                    └── password.service.ts
                    └── role.enum.ts
                    └── 📁strategies
                        └── jwt.strategy.ts
                └── 📁users
                    └── 📁dto
                        └── create-user.dto.ts
                    └── user.entity.ts
                    └── users.module.ts
                    └── users.resolvers.ts
                    └── users.service.ts
        └── public.orm.config.ts
        └── schema.gql
        └── seed.ts
        └── tenants.orm.config.ts
    └── tsconfig.build.json
    └── tsconfig.json
```
### ORM Configuration

There are two TypeORM configuration files:
- `public.orm.config.ts`: Configuration for public entities.
- `tenants.orm.config.ts`: Configuration for tenanted entities.

### Migrations

- **Public Migrations**: Standard TypeORM migration setup for the public schema.
- **Tenants Migrations**: Manually written migrations for tenanted schemas, ensuring tables are prefixed with their schema name and constraint keys are uniquely labeled.

### Handling Requests

Requests are handled using an `x-tenant-id` header property sent with each request. The tenancy module middleware extracts this header and attaches it to the request. Each request is scoped to obtain the correct connection, ensuring operations are performed on the correct schema based on the provided tenant ID.

### Security

- **Authorize Guard**: Utilizes password JWT to authenticate requests and verify the correct tenant ID.

### Application Workflow

Upon application startup:
- Public migrations are executed.
- For each tenant, a schema is created in the database.
- When an authenticated user creates a tenant:
  - The tenant service creates the tenant.
  - A new schema is created in the database for the tenant.
  - Migrations are run in this schema.
  - The connection to this schema is closed.
  - The user is added to the tenants users with admin role, enabling them to create/invite users to their tenant.


### Testing
- I added just one e2e test as POC. 


## Running the app

```bash
docker compose up 
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```