import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateWarehouseStateTable1691674508417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
        .createTable(
          new Table({
            name: "warehouses_states",
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
            "warehouses_states",
            new TableIndex({
              columnNames: ["name"],
            })
          )
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('warehouses_states');
    }

}
