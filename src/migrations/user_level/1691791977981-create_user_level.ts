import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateUserLevel1691791977981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .createTable(
        new Table({
          name: "user_levels",
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
              name: "observations",
              type: "varchar",
            },
            {
              name: "service_id",
              type: "integer",
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
          "user_levels",
          new TableIndex({
            columnNames: ["name"],
          })
        );

        queryRunner.createForeignKey(
          "user_levels",
          new TableForeignKey({
            columnNames: ["service_id"],
            referencedTableName: "services",
            referencedColumnNames: ["id"],
          })
        );
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_levels");
  }
}
