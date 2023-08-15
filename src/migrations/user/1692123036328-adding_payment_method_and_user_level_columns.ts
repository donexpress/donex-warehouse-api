import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class AddingPaymentMethodAndUserLevelColumns1692123036328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users"
            ADD COLUMN user_level_id integer,
            ADD COLUMN payment_method_id integer;
            `,
        ).then(() => {
            queryRunner.createForeignKey(
                "users",
                new TableForeignKey({
                    columnNames: ['user_level_id'],
                    referencedTableName: 'user_levels',
                    referencedColumnNames: ['id']
                })
            )
            queryRunner.createForeignKey(
                "users",
                new TableForeignKey({
                    columnNames: ['payment_method_id'],
                    referencedTableName: 'payment_methods',
                    referencedColumnNames: ['id']
                })
            )
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
