import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateAosWarehouseTable1692286529351 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "aos_warehouses",
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
                            name: "code",
                            type: "varchar",
                        },
                        {
                            name: "contact",
                            type: "varchar",
                        },
                        {
                            name: "company",
                            type: "varchar",
                        },
                        {
                            name: "country",
                            type: "varchar",
                        },
                        {
                            name: "address_1",
                            type: "varchar",
                        },
                        {
                            name: "address_2",
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
                            name: "cp",
                            type: "varchar",
                        },
                        {
                            name: "phone",
                            type: "varchar",
                        },
                        {
                            name: "email",
                            type: "varchar",
                        },
                        {
                            name: "observations",
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
            .then(() => {
                queryRunner.createIndex(
                    "aos_warehouses",
                    new TableIndex({
                        columnNames: ["name"],
                    })
                );
                queryRunner.createIndex(
                    "aos_warehouses",
                    new TableIndex({
                        columnNames: ["code"],
                    })
                );
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("aos_warehouses");
    }

}
