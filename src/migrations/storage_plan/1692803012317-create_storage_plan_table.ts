import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateStoragePlanTable1692803012317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
          .createTable(
            new Table({
              name: 'storage_plans',
              columns: [
                {
                  name: 'id',
                  type: 'integer',
                  isGenerated: true,
                  generationStrategy: 'increment',
                  isPrimary: true,
                },
                {
                    name: 'customer_order_number',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'warehouse_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'type',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'box_amount',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'delivered_time',
                    type: 'timestamp',
                    isNullable: true
                },
                {
                    name: 'observations',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'user_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'order_number',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'state',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'country',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'weight',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'volume',
                    type: 'float',
                    isNullable: true
                },
                {
                    name: 'out_boxes',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'stock_boxes',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'history',
                    type: 'json',
                    isNullable: true
                },
                {
                    name: 'ready',
                    type: 'boolean',
                    isNullable: true,
                    default: false
                },
                {
                    name: 'changes',
                    type: 'boolean',
                    isNullable: true,
                    default: false
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
              'storage_plans',
              new TableIndex({
                columnNames: ['customer_order_number'],
              })
            );
            queryRunner.createIndex(
                'storage_plans',
                new TableIndex({
                  columnNames: ['order_number'],
                })
              );
          });
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('storage_plans');
      }

}
