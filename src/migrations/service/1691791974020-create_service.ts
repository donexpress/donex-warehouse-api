import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateService1691791974020 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "services",
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
                    "services",
                    new TableIndex({
                        columnNames: ["name"],
                    })
                )
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('services');
    }

}
