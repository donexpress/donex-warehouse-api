import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddScopeAndTypeToRoles1694136200355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('roles', [
      new TableColumn({
        name: 'type',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'scope',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('roles', [
      new TableColumn({
        name: 'type',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'scope',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }
}
