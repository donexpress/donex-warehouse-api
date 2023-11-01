import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddRelabelColumnOnOutputPlan1698863608690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('output_plans', [
          new TableColumn({
            name: 'relabel',
            type: 'boolean',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('output_plans', [
          new TableColumn({
            name: 'relabel',
            type: 'boolean',
            isNullable: true
          })
        ]);
      }

}
