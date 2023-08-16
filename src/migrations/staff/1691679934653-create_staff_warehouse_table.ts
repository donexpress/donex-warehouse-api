import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateStaffWarehouseTable1691679934653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "staff_warehouses_warehouse",
                    columns: [
                        {
                            name: "staff_id",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "warehouse_id",
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
                    "staff_warehouses_warehouse",
                    new TableIndex({
                        columnNames: ["staff_id"],
                    })
                )
                queryRunner.createForeignKey(
                    "staff_warehouses_warehouse",
                    new TableForeignKey({
                        name: 'staff',
                        columnNames: ['staff_id'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "staff_warehouses_warehouse",
                    new TableForeignKey({
                        name: 'warehouses',
                        columnNames: ['warehouse_id'],
                        referencedTableName: 'warehouses',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('staff_warehouses_warehouse');
    }

}
