import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ChangeCargoStationStateIdNotNull1692395896931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('warehouses', 'state_id', new TableColumn({
            name: 'state_id',
            type: 'integer',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('warehouses', 'state_id', new TableColumn({
            name: 'state_id',
            type: 'integer',
            isNullable: false
        }))
    }

}
