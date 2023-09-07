import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStateToWarehouse1694050332744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('warehouses', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('warehouses', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      }),
    ]);
  }
}
