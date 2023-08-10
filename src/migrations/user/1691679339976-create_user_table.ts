import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateUserTable1691679339976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "user",
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
                    "user",
                    new TableIndex({
                        columnNames: ["username"],
                    })
                )
                queryRunner.createForeignKey(
                    "user",
                    new TableForeignKey({
                        columnNames: ['stateId'],
                        referencedTableName: 'user_state',
                        referencedColumnNames: ['id']
                    })
                )

                queryRunner.createForeignKey(
                    "user",
                    new TableForeignKey({
                        columnNames: ['departamentId'],
                        referencedTableName: 'departament',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "user",
                    new TableForeignKey({
                        columnNames: ['roleId'],
                        referencedTableName: 'role',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }

}
