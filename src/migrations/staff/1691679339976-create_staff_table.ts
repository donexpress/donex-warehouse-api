import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateStaffTable1691679339976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "staff",
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
                            isNullable: false,
                        },
                        {
                            name: "chinesse_name",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "english_name",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "password",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "email",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "phone",
                            type: "varchar",
                            isNullable: true,
                            default: null
                        },
                        {
                            name: "observations",
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
                            name: "departamentId",
                            type: "integer",
                            isNullable: false,
                        },
                        {
                            name: "roleId",
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
            .then(() =>{
                queryRunner.createIndex(
                    "staff",
                    new TableIndex({
                        columnNames: ["username"],
                    })
                )
                queryRunner.createForeignKey(
                    "staff",
                    new TableForeignKey({
                        columnNames: ['stateId'],
                        referencedTableName: 'staff_states',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "staff",
                    new TableForeignKey({
                        columnNames: ['departamentId'],
                        referencedTableName: 'departaments',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "staff",
                    new TableForeignKey({
                        columnNames: ['roleId'],
                        referencedTableName: 'roles',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('staff');
    }

}
