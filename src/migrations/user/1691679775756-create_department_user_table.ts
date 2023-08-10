import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateDepartmentUserTable1691679775756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "departament_user",
                    columns: [
                        {
                            name: "userId",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "departamentId",
                            type: "integer",
                            isPrimary: true,
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
                    "departament_user",
                    new TableIndex({
                        columnNames: ["userId"],
                    })
                )
                queryRunner.createForeignKey(
                    "departament_user",
                    new TableForeignKey({
                        columnNames: ['userId'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "departament_user",
                    new TableForeignKey({
                        columnNames: ['departamentId'],
                        referencedTableName: 'departament',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('departament_user');
    }

}
