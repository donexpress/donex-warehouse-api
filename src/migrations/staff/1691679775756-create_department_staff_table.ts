import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateDepartmentStaffTable1691679775756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "departaments_staff",
                    columns: [
                        {
                            name: "staffId",
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
                    "departaments_staff",
                    new TableIndex({
                        columnNames: ["staffId"],
                    })
                )
                queryRunner.createForeignKey(
                    "departaments_staff",
                    new TableForeignKey({
                        columnNames: ['staffId'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "departaments_staff",
                    new TableForeignKey({
                        columnNames: ['departamentId'],
                        referencedTableName: 'departaments',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('departaments_staff');
    }

}
