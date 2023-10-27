import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexToStoragePlan1698235867871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['state'],
      })
    );
    await queryRunner.createIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['user_id'],
      })
    );
    await queryRunner.createIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['warehouse_id'],
      })
    );
    await queryRunner.createIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['reference_number'],
      })
    );
    await queryRunner.createIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['pr_number'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['state'],
      })
    );
    await queryRunner.dropIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['user_id'],
      })
    );
    await queryRunner.dropIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['warehouse_id'],
      })
    );
    await queryRunner.dropIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['reference_number'],
      })
    );
    await queryRunner.dropIndex(
      'storage_plans',
      new TableIndex({
        columnNames: ['pr_number'],
      })
    );
  }
}
