import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexToOperationInstruction1698850070069
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'operation_instructions',
      new TableIndex({
        columnNames: ['state'],
      })
    );

    await queryRunner.createIndex(
      'operation_instructions',
      new TableIndex({
        columnNames: ['output_plan_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'operation_instructions',
      new TableIndex({
        columnNames: ['state'],
      })
    );

    await queryRunner.dropIndex(
      'operation_instructions',
      new TableIndex({
        columnNames: ['output_plan_id'],
      })
    );
  }
}
