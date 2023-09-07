import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStateToUsers1694050198449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true
      }),
    ]);
  }
}
