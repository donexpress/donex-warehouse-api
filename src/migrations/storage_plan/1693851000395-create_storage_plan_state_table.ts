import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStoragePlanStateTable1693851000395
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'storage_plan_states',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'meta',
              type: 'json',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: "timezone('utc', now())",
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: "timezone('utc', now())",
            },
          ],
        }),
        true
      )
      .then(() => {
        queryRunner.createIndex(
          'storage_plan_states',
          new TableIndex({
            columnNames: ['name'],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('storage_plan_states');

  }
}
