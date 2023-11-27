import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRegionalDivisionFields1696442844782
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('regional_divisions', [
      new TableColumn({
        name: 'type',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'company',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'country',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cp',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'rules',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('organizations', [
      new TableColumn({
        name: 'type',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'company',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'country',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cp',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'rules',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }
}
