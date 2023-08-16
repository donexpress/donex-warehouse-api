import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddingPaymentMethodAndUserLevelColumns1692123036328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(
        //     `ALTER TABLE "users"
        //     ADD COLUMN user_level_id integer,
        //     ADD COLUMN payment_method_id integer;
        //     `,
        // )
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "user_level_id",
                type: "integer",
                isNullable: true,
                default: null
            }),
            new TableColumn({
                name: "payment_method_id",
                type: "integer",
                isNullable: true,
                default: null
            })
        ])
        .then(() => {
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
        const table = await queryRunner.getTable("users")
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("user_level_id") !== -1,
        )
        await queryRunner.dropForeignKey("users", foreignKey)
        await queryRunner.dropColumn("users", "user_level_id")

        const foreignKeyPayment = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("payment_method_id") !== -1,
        )
        await queryRunner.dropForeignKey("users", foreignKeyPayment)
        await queryRunner.dropColumn("users", "payment_method_id")
    }

}
