import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateStateValue1694795177739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'storage_plans',
      new TableColumn({
        name: 'state',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'storage_plans',
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true,
      })
    );
  }
}
