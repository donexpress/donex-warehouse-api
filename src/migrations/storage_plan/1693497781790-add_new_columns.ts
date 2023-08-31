import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddNewColumns1693497781790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('storage_plans',[
            new TableColumn({
                name: 'rejected_boxes',
                type: 'boolean',
                default: false,
                isNullable: true
            }),
            new TableColumn({
                name: 'return',
                type: 'boolean',
                default: false,
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('storage_plans',[
            new TableColumn({
                name: 'rejected_boxes',
                type: 'boolean',
                default: false,
                isNullable: true
            }),
            new TableColumn({
                name: 'return',
                type: 'boolean',
                default: false,
                isNullable: true
            }),
        ]);
    }

}
