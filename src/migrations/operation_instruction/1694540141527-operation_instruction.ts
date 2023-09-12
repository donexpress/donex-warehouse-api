import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class OperationInstruction1694540141527 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'operation_instructions',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'operation_instruction_type',
              type: 'varchar',
            },
            {
              name: 'output_plan_id',
              type: 'integer',
            },
            {
              name: 'warehouse_id',
              type: 'integer',
            },
            {
              name: 'user_id',
              type: 'integer',
            },
            {
              name: 'type',
              type: 'varchar',
            },
            {
              name: 'number_delivery',
              type: 'varchar',
            },
            {
              name: 'remark',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'internal_remark',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'client_display',
              type: 'boolean',
              default: false,
            },
            {
              name: 'state',
              type: 'varchar'
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
          'operation_instructions',
          new TableIndex({
            columnNames: ['number_delivery'],
          })
        )
      )
      .then(() =>
        queryRunner.createIndex(
          'operation_instructions',
          new TableIndex({
            columnNames: ['warehouse_id'],
          })
        )
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operation_instructions');
  }
}
