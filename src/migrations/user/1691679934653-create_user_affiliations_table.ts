import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm"

export class CreateUserAffiliationTable1691679934653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .createTable(
                new Table({
                    name: "user_affiliations_affiliation",
                    columns: [
                        {
                            name: "userId",
                            type: "integer",
                            isPrimary: true,
                        },
                        {
                            name: "affiliationId",
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
                    "user_affiliations_affiliation",
                    new TableIndex({
                        columnNames: ["userId"],
                    })
                )
                queryRunner.createForeignKey(
                    "user_affiliations_affiliation",
                    new TableForeignKey({
                        name: 'user',
                        columnNames: ['userId'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id']
                    })
                )
                queryRunner.createForeignKey(
                    "user_affiliations_affiliation",
                    new TableForeignKey({
                        name: 'affiliation',
                        columnNames: ['affiliationId'],
                        referencedTableName: 'affiliation',
                        referencedColumnNames: ['id']
                    })
                )
            });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_affiliations_affiliation');
    }

}
