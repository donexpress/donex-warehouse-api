import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateStaffWarehouseTable1691679934653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "staff_warehouses_warehouse",
                    columns: [
                        {
                            name: "staffId",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "warehouseId",
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
                        columnNames: ["staffId"],
                    })
                )
                queryRunner.createForeignKey(
                    "staff_warehouses_warehouse",
                    new TableForeignKey({
                        name: 'staff',
                        columnNames: ['staffId'],
                        referencedTableName: 'staff',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "staff_warehouses_warehouse",
                    new TableForeignKey({
                        name: 'warehouses',
                        columnNames: ['warehouseId'],
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
