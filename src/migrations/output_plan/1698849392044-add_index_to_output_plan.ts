import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexToOutputPlan1698849392044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'output_plans',
      new TableIndex({
        columnNames: ['state'],
      })
    );

    await queryRunner.createIndex(
      'output_plans',
      new TableIndex({
        columnNames: ['reference_number'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'output_plans',
      new TableIndex({
        columnNames: ['state'],
      })
    );

    await queryRunner.dropIndex(
      'output_plans',
      new TableIndex({
        columnNames: ['reference_number'],
      })
    );
  }
}
