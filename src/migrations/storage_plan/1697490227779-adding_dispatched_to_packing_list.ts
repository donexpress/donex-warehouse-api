import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingDispatchedToPackingList1697490227779
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('packing_lists', [
      new TableColumn({
        name: 'dispatched',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'dispatched_time',
        type: 'timestamp',
        default: null,
        isNullable: true
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('packing_lists', [
      new TableColumn({
        name: 'dispatched',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'dispatched_time',
        type: 'timestamp',
        default: null,
        isNullable: true
      }),
    ]);
  }
}
