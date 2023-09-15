import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddDestinationColumnToOutputPlan1694794573431 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('output_plans', [
          new TableColumn({
            name: 'destination',
            type: 'varchar',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('output_plans', [
          new TableColumn({
            name: 'destination',
            type: 'varchar',
            isNullable: true
          })
        ]);
      }

}
