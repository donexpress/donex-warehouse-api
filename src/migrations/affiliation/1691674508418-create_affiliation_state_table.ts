import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateAffiliationStateTable1691674508418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
        .createTable(
          new Table({
            name: "affiliation_state",
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
            "affiliation_state",
            new TableIndex({
              columnNames: ["name"],
            })
          )
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('affiliation_state');
    }

}
