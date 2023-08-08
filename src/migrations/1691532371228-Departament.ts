import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Departament1691532371228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: "departaments",
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
              isNullable: true,
              default: null,
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
          "departaments",
          new TableIndex({
            columnNames: ["name"],
          })
        )
      );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('departaments');
  }
}
