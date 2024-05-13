import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { tenancyMiddleware } from '../src/modules/tenancy/tenancy.middleware';

describe('TenantsResolver (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(tenancyMiddleware);
    await app.init();
    // Obtain JWT token for authentication
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set({ 'x-tenant-id': `03eb0cf1-6f1f-499e-bdb7-5ae3662858aa` })
      .send({
        query: `
        mutation {
          login(loginInput: { email: "admin@admin.com", password:"P@ssw0rd" }) {
            accessToken
          }
        }
      `,
      });
    token = response.body.data.login.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a tenant', async () => {
    const createTenantDto = {
      name: 'Test Tenant',
    };

    // Make HTTP request to create tenant
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set({
        'x-tenant-id': `03eb0cf1-6f1f-499e-bdb7-5ae3662858aa`,
        Authorization: `Bearer ${token}`,
      })
      .send({
        query: `
          mutation {
            createTenant(createTenantInput: { name: "${createTenantDto.name}" }) {
              id
              name
            }
          }
        `,
      })
      .expect(200);

    // Verify response
    expect(response.body).toEqual({
      data: {
        createTenant: {
          id: expect.any(String),
          name: createTenantDto.name,
        },
      },
    });
  });
});
