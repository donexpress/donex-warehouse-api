import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateUserTable1692032621926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: "users",
          columns: [
            {
              name: "id",
              type: "integer",
              isGenerated: true,
              generationStrategy: "increment",
              isPrimary: true,
            },
            {
              name: "user_level_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "customer_number",
              type: "integer",
            },
            {
              name: "payment_method_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "username",
              type: "varchar",
            },
            {
              name: "nickname",
              type: "varchar",
            },
            {
              name: "label_code",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "password",
              type: "varchar",
            },
            {
              name: "contact",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "company",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "email",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "phone",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "qq",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "credits",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "observations",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "finantial_representative",
              type: "integer",
              isNullable: true,
            },
            {
              name: "client_service_representative",
              type: "integer",
              isNullable: true,
            },
            {
              name: "sales_representative",
              type: "integer",
              isNullable: true,
            },
            {
              name: "sales_source",
              type: "integer",
              isNullable: true,
            },
            {
              name: "subsidiary_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "regional_division_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "warehouse_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "state_id",
              type: "integer",
              isNullable: true,
            },
            {
              name: "shipping_control",
              type: "boolean",
              default: false,
            },
            {
              name: "hidde_transfer_order",
              type: "boolean",
              default: false,
            },
            {
              name: "reset_password",
              type: "boolean",
              default: false,
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
          "users",
          new TableIndex({
            columnNames: ["username"],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
