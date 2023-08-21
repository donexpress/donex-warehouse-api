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
              isNullable: true,
            },
            {
              name: "principal",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "contact_phone",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "address",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "city",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "province",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "country",
              isNullable: true,
              type: "varchar",
            },
            {
              name: "cp",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "shared_warehouse_system_code",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "shared_warehouse_docking_code",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "customer_order_number_rules",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "state_id",
              type: "integer",
              isNullable: true,
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
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("warehouses");
  }
}
