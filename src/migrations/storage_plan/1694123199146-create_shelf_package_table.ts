import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateShelfPackageTable1694123199146
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'shelf_packages',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'shelf_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'package_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'layer',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'column',
              type: 'integer',
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
          'shelf_packages',
          new TableIndex({
            columnNames: ['shelf_id'],
          })
        );
        queryRunner.createIndex(
          'shelf_packages',
          new TableIndex({
            columnNames: ['id'],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shelf_packages');
  }
}
