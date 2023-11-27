import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddOperationInstructionToApendixTable1695419462953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('appendages', [
          new TableColumn({
            name: 'operation_instruction_id',
            type: 'integer',
            isNullable: true
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('appendages', [
          new TableColumn({
            name: 'operation_instruction_id',
            type: 'integer',
            isNullable: true
          })
        ]);
      }

}
