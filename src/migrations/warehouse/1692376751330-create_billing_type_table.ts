import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateBillingTypeTable1692376751330 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
          .createTable(
            new Table({
              name: 'shelf_billing_types',
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
                    type: 'varchar'
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
          .then(() => {
            queryRunner.createIndex(
              'shelf_billing_types',
              new TableIndex({
                columnNames: ['name'],
              })
            );
          });
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('shelf_billing_types');
      }

}
