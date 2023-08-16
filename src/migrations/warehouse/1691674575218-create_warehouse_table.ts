import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateWarehouseTable1691674575218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: "warehouses",
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
              type: "varchar",
            },
            {
              name: "english_name",
              type: "varchar",
            },
            {
              name: "receiving_area",
              type: "varchar",
            },
            {
              name: "principal",
              type: "varchar",
            },
            {
              name: "contact_phone",
              type: "varchar",
            },
            {
              name: "address",
              type: "varchar",
            },
            {
              name: "city",
              type: "varchar",
            },
            {
              name: "province",
              type: "varchar",
            },
            {
              name: "country",
              type: "varchar",
            },
            {
              name: "cp",
              type: "varchar",
            },
            {
              name: "shared_warehouse_system_code",
              type: "varchar",
            },
            {
              name: "shared_warehouse_docking_code",
              type: "varchar",
            },
            {
              name: "customer_order_number_rules",
              type: "varchar",
            },
            {
              name: "state_id",
              type: "integer",
              isNullable: false,
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
      .then(() => {
        queryRunner.createIndex(
          "warehouses",
          new TableIndex({
            columnNames: ["name"],
          })
        );
        queryRunner.createIndex(
          "warehouses",
          new TableIndex({
            columnNames: ["receiving_area"],
          })
        );
        queryRunner.createForeignKey(
          "warehouses",
          new TableForeignKey({
            columnNames: ["state_id"],
            referencedTableName: "warehouses_states",
            referencedColumnNames: ["id"],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("warehouses");
  }
}
