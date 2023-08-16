import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm"

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
                            name: "username",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "nickname",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "label_code",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "password",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "contact",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "company",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "email",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "phone",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "qq",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "credits",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "observations",
                            type: "varchar",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "state_id",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "finantial_representative",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "client_service_representative",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "sales_representative",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "sales_source",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "subsidiary_id",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "regional_division_id",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "warehouse_id",
                            type: "integer",
                            isNullable: true,
                            default: null,
                        },
                        {
                            name: "stateId",
                            type: "integer",
                            isNullable: true,
                            default: null,
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
            .then(() =>{
                queryRunner.createIndex(
                    "users",
                    new TableIndex({
                        columnNames: ["username"],
                    })
                )
                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['stateId'],
                        referencedTableName: 'user_states',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['finantial_representative'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['client_service_representative'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['sales_representative'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['sales_source'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['subsidiary_id'],
                        referencedTableName: 'subsidiaries',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['regional_division_id'],
                        referencedTableName: 'regional_divisions',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ['warehouse_id'],
                        referencedTableName: 'warehouses',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
