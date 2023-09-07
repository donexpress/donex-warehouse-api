import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStateToStaff1694049886494 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('staff', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('staff', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      })
    ]);
  }
}
