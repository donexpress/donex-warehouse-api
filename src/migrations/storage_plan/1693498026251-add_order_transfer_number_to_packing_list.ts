import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddOrderTransferNumberToPackingList1693498026251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('packing_lists',
            new TableColumn({
                name: 'order_transfer_number',
                type: 'varchar',
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('packing_lists',
        new TableColumn({
            name: 'order_transfer_number',
            type: 'varchar',
            isNullable: true
        })
    );
    }

}
