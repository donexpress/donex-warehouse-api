import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateLineClassificationTable1693236515842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
          .createTable(
            new Table({
              name: 'line_classifications',
              columns: [
                {
                  name: 'id',
                  type: 'integer',
                  isGenerated: true,
                  generationStrategy: 'increment',
                  isPrimary: true,
                },
                {
                  name: 'name',
                  type: 'varchar',
                },
                {
                  name: 'channels',
                  type: 'integer',
                  isNullable: true,
                },
                {
                  name: 'billing_account',
                  type: 'integer',
                  isNullable: true,
                },
                {
                    name: 'meta',
                    type: 'json',
                    isNullable: true
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
          .then(() =>
            queryRunner.createIndex(
              'line_classifications',
              new TableIndex({
                columnNames: ['name'],
              })
            )
          );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('line_classifications');
      }

}
