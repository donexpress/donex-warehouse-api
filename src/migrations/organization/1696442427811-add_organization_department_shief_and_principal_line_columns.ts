import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddOrganizationDepartmentShiefAndPrincipalLineColumns1696442427811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('organizations', [
          new TableColumn({
            name: 'head_of_department',
            type: 'integer[]',
            isNullable: true
          }),
          new TableColumn({
            name: 'principal_line',
            type: 'integer[]',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('organizations', [
            new TableColumn({
                name: 'head_of_department',
                type: 'integer[]',
                isNullable: true
              }),
              new TableColumn({
                name: 'principal_line',
                type: 'integer[]',
                isNullable: true
              }),
        ]);
      }

}
