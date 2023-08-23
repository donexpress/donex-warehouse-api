import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreatePackingListTable1692803537263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
          .createTable(
            new Table({
              name: 'packing_lists',
              columns: [
                {
                  name: 'id',
                  type: 'integer',
                  isGenerated: true,
                  generationStrategy: 'increment',
                  isPrimary: true,
                },
                {
                    name: 'box_number',
                    type: 'varchar',
                    isNullable: true
                },
                {
                  name: 'case_number',
                  type: 'varchar',
                  isNullable: true
              },
                {
                    name: 'client_weight',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'client_length',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'client_width',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'client_height',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'product_sku',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'amount',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'product_name',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'english_product_name',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'price',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'material',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'customs_code',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'fnscu',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'custome_picture',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'operator_picture',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'storage_plan_id',
                    type: 'integer',
                    isNullable: true
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
          .then(() => {
            queryRunner.createIndex(
              'packing_lists',
              new TableIndex({
                columnNames: ['box_number'],
              })
            );
          });
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('packing_lists');
      }

}
