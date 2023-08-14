import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreatePaymentMethod1691785410589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "payment_methods",
                    columns: [
                        {
                            name: "id",
                            type: "integer",
                            isGenerated: true,
                            generationStrategy: "increment",
                            isPrimary: true,
                        },
                        {
                            name: "code",
                            type: "varchar",
                            isNullable: true,
                            default: null,
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
                    "payment_methods",
                    new TableIndex({
                        columnNames: ["name"],
                    })
                )
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('payment_methods');
    }

}
