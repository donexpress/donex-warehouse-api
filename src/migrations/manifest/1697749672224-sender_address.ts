import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class SenderAddress1697749672224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sender_addresses',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'manifest_id',
            type: 'integer'
          },
          {
            name: 'name_receiver',
            type: 'varchar',
          },
          {
            name: 'tax_id',
            type: 'varchar',
          },
          {
            name: 'address1',
            type: 'varchar',
          },
          {
            name: 'address2',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'country',
            type: 'varchar',
          },
          {
            name: 'code_zip',
            type: 'varchar',
          },
          {
            name: 'phone_number',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sender_addresses');
  }
}
