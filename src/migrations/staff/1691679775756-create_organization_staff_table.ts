import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateDepartmentStaffTable1691679775756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "organizations_staff",
                    columns: [
                        {
                            name: "staff_id",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "organization_id",
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
                        columnNames: ["staff_id"],
                    })
                )
                queryRunner.createForeignKey(
                    "organizations_staff",
                    new TableForeignKey({
                        columnNames: ['staff_id'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "organizations_staff",
                    new TableForeignKey({
                        columnNames: ['organization_id'],
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
