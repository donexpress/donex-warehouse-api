import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Manifest1697749722344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'manifests',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'waybill_id',
            type: 'varchar',
          },
          {
            name: 'bag_code',
            type: 'varchar',
          },
          {
            name: 'bag_id',
            type: 'varchar',
          },
          {
            name: 'tracking_number',
            type: 'varchar',
          },
          {
            name: 'client_reference',
            type: 'varchar',
          },
          {
            name: 'manifest_name',
            type: 'varchar',
          },
          {
            name: 'weigth',
            type: 'varchar'
          },
          {
            name: 'unit_weigth',
            type: 'float',
            default: 0
          },
          {
            name: 'total_declare',
            type: 'float',
            default: 0
          },
          {
            name: 'currency',
            type: 'varchar',
          },
          {
            name: 'item_title',
            type: 'varchar',
          },
          {
            name: 'item_description',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'pieces',
            type: 'integer',
          },
          {
            name: 'shipping_cost',
            type: 'float',
            default: 0
          },
          {
            name: 'sale_price',
            type: 'float',
            default: 0
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'paid',
            type: 'boolean',
            default: false,
          },
          {
            name: 'payment_voucher',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bill_state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'carrier',
            type: 'varchar'
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
    );
    await queryRunner.createIndex(
      'manifests',
      new TableIndex({
        columnNames: ['waybill_id'],
      })
    );
    await queryRunner.createIndex(
      'manifests',
      new TableIndex({
        columnNames: ['tracking_number'],
      })
    );
    await queryRunner.createIndex(
        'manifests',
        new TableIndex({
          columnNames: ['state'],
        })
      );
      await queryRunner.createIndex(
        'manifests',
        new TableIndex({
          columnNames: ['client_reference'],
        })
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('manifests');
  }
}
