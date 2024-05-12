import { MigrationInterface } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';

export class AddUsers1638963474130 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/typedef
  name = 'AddUsers1638963474130';

  public async up(queryRunner: PostgresQueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;

    await queryRunner.query(
      `CREATE TABLE "${schema}"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_${schema}_4873483882def9ba79ad5ccddbf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: PostgresQueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;

    await queryRunner.query(`DROP TABLE "${schema}"."users"`);
  }
}
