import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Organization1691532371228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: "organizations",
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
              name: "parent_organization",
              type: "varchar"
            },
            {
              name: "organization_type",
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
          "organizations",
          new TableIndex({
            columnNames: ["name"],
          })
        )
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organizations');
  }
}
