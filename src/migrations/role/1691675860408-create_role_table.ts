import { MigrationInterface, QueryRunner, Table, TableIndex, } from "typeorm"

export class CreateRoleTable1691675860408 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
        .createTable(
            new Table({
                name: "role",
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
                "role",
                new TableIndex({
                    columnNames: ["name"],
                })
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('role');
    }

}
