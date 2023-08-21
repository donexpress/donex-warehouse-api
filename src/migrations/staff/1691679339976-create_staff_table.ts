import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateStaffTable1691679339976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: 'staff',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
            },
            {
              name: 'username',
              type: 'varchar',
            },
            {
              name: 'chinesse_name',
              type: 'varchar',
            },
            {
              name: 'english_name',
              type: 'varchar',
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'phone',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'observations',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'state_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'organization_id',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'role_id',
              type: 'integer',
              isNullable: false,
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
      .then(() => {
        queryRunner.createIndex(
          'staff',
          new TableIndex({
            columnNames: ['username'],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('staff');
  }
}
