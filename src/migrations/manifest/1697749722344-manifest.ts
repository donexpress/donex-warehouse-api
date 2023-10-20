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
            name: 'manifest_name',
            type: 'varchar',
          },
          {
            name: 'client_reference',
            type: 'varchar',
          },
          {
            name: 'order_id',
            type: 'varchar',
          },
          {
            name: 'tracking_number',
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
            name: 'weigth',
            type: 'float',
            default: 0
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
            name: 'currency',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'receiver_country',
            type: 'varchar',
          },
          {
            name: 'sender_country',
            type: 'varchar',
            isNullable: true,
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
        columnNames: ['order_id'],
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
