import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateAppendixTable1694562645142 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
          .createTable(
            new Table({
              name: 'appendages',
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
                  name: 'user_id',
                  type: 'integer',
                  isNullable: true,
                },
                {
                  name: 'function',
                  type: 'varchar',
                  isNullable: true,
                },
                {
                  name: 'url',
                  type: 'varchar',
                  isNullable: true,
                },
                {
                  name: 'meta',
                  type: 'json',
                  isNullable: true,
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
              'appendages',
              new TableIndex({
                columnNames: ['id', 'user_id'],
              })
            )
          );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('appendages');
      }

}
