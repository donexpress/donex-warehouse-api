import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateStaffStateTable1691679332765 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
        .createTable(
          new Table({
            name: "staff_states",
            columns: [
              {
                name: "id",
                type: "integer",
                isGenerated: true,
                generationStrategy: "increment",
                isPrimary: true,
              },
              {
                name: "name",
                type: "varchar"
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "timezone('utc', now())",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "timezone('utc', now())",
              },
            ],
          }),
          true
        )
        .then(() =>
          queryRunner.createIndex(
            "staff_states",
            new TableIndex({
              columnNames: ["name"],
            })
          )
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('staff_states');
    }

}
