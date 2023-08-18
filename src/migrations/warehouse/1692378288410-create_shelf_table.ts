import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateShelfTable1692378288410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'shelves',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'partition_table',
              type: 'integer',
            },
            {
              name: 'warehouse_id',
              type: 'integer',
            },
            {
              name: 'number_of_shelves',
              type: 'integer',
            },
            {
              name: 'layers',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'column_ammount',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'location_length',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'location_width',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'high_inventory',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'shelves_type_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'location_type_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'billing_mode_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'designated_user',
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
          'shelves',
          new TableIndex({
            columnNames: ['id'],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shelves');
  }
}
