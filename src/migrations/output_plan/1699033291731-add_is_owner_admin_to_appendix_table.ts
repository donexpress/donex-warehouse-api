import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddIsOwnerAdminToAppendixTable1699033291731 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('appendages', [
          new TableColumn({
            name: 'is_owner_admin',
            type: 'boolean',
            default: false
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('appendages', [
          new TableColumn({
            name: 'is_owner_admin',
            type: 'boolean',
            default: false
          })
        ]);
      }

}
