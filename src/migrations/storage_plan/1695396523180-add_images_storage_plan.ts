import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImagesStoragePlan1695396523180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('storage_plans', [
      new TableColumn({
        name: 'images',
        type: 'json',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_images',
        type: 'boolean',
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('storage_plans', [
      new TableColumn({
        name: 'images',
        type: 'json',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_images',
        type: 'boolean',
        default: false,
      }),
    ]);
  }
}
