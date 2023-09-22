import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddReferenceNumberAndPrNumberToStoragePlanTable1695392911611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("storage_plans", [
            new TableColumn({
                name: 'reference_number',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'pr_number',
                type: 'varchar',
                isNullable: true,
            }),
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("storage_plans", [
            new TableColumn({
                name: 'reference_number',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'pr_number',
                type: 'varchar',
                isNullable: true,
            }),
        ])
    }

}
