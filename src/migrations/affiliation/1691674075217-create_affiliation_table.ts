import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";


export class CreateAffiliationTable1691674075217 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "affiliation",
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
                            isNullable: false,
                        },
                        {
                            name: "english_name",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "receiving_area",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "principal",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "contact_phone",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "address",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "city",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "province",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "country",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "cp",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "shared_warehouse_system_code",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "shared_warehouse_docking_code",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "customer_order_number_rules",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "stateId",
                            type: "integer",
                            isNullable: false,
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
                    "affiliation",
                    new TableIndex({
                        columnNames: ["name"],
                    })
                )
                queryRunner.createForeignKey(
                    "affiliation",
                    new TableForeignKey({
                        columnNames: ['stateId'],
                        referencedTableName: 'affiliation_state',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('affiliation');
    }

}
