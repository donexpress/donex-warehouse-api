import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddStateToOutputPlan1694189287615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('output_plans', [
          new TableColumn({
            name: 'state',
            type: 'varchar',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('output_plans', [
          new TableColumn({
            name: 'state',
            type: 'varchar',
            isNullable: true
          })
        ]);
      }

}
