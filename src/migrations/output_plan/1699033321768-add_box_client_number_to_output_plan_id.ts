import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBoxClientNumberToOutputPlanId1699033321768
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('output_plans', [
      new TableColumn({
        name: 'client_box_number',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('appendages', [
      new TableColumn({
        name: 'client_box_number',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }
}
