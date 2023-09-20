import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateOperationInstructionTypeToJson1695233071326
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'operation_instructions',
      new TableColumn({
        name: 'operation_instruction_type',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'operation_instruction_type',
        type: 'json',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'operation_instructions',
      new TableColumn({
        name: 'operation_instruction_type',
        type: 'json',
      })
    );
  }
}
