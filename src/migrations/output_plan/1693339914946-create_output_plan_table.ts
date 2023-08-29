import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOutputPlanTable1693339914946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'output_plans',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'output_number',
              type: 'varchar',
            },
            {
              name: 'user_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'warehouse_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'country',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'city',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'address',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'observations',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'delivered_time',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'type',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'box_amount',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'palets_amount',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'output_boxes',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'amount',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'delivered_quantity',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'case_numbers',
              type: 'varchar[]',
              isNullable: true,
              default: 'array[]::varchar[]',
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
      .then(() =>
        queryRunner.createIndex(
          'output_plans',
          new TableIndex({
            columnNames: ['output_number'],
          })
        )
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('output_plans');
  }
}
