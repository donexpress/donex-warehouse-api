import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddReferenceNumberColumn1696618194882 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('output_plans', [
          new TableColumn({
            name: 'reference_number',
            type: 'varchar',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('output_plans', [
          new TableColumn({
            name: 'reference_number',
            type: 'varchar',
            isNullable: true
          })
        ]);
      }

}
