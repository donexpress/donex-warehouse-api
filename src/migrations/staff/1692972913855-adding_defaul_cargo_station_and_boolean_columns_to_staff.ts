import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddingDefaulCargoStationAndBooleanColumnsToStaff1692972913855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('staff', [
            new TableColumn({
                name: 'default_cargo_station_id',
                type: 'integer',
                isNullable: true,
                default: null
            }),
            new TableColumn({
                name: 'change_password_on_login',
                type: 'boolean',
                default: false
            }),
            new TableColumn({
                name: 'allow_search',
                type: 'boolean',
                default: false
            }),
            new TableColumn({
                name: 'meta',
                type: 'json',
                isNullable: true
            }),
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('staff', [
            new TableColumn({
                name: 'default_cargo_station_id',
                type: 'integer',
                isNullable: true,
                default: null
            }),
            new TableColumn({
                name: 'change_password_on_login',
                type: 'boolean',
                default: false
            }),
            new TableColumn({
                name: 'allow_search',
                type: 'boolean',
                default: false
            }),
            new TableColumn({
                name: 'meta',
                type: 'json',
                isNullable: true
            }),
        ])
    }

}
