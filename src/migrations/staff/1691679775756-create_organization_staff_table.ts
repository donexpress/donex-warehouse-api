import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateDepartmentStaffTable1691679775756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "organizations_staff",
                    columns: [
                        {
                            name: "staffId",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "organizationId",
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
                    "organizations_staff",
                    new TableIndex({
                        columnNames: ["staffId"],
                    })
                )
                queryRunner.createForeignKey(
                    "organizations_staff",
                    new TableForeignKey({
                        columnNames: ['staffId'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "organizations_staff",
                    new TableForeignKey({
                        columnNames: ['organizationId'],
                        referencedTableName: 'organizations',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('organizations_staff');
    }

}
