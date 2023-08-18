import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeStateAndOrganizationIdToNullable1692398913841
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('staff', [
      {
        oldColumn: new TableColumn({
          name: 'state_id',
          type: 'integer',
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'state_id',
          type: 'integer',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'organization_id',
          type: 'integer',
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'organization_id',
          type: 'integer',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'role_id',
          type: 'integer',
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'role_id',
          type: 'integer',
          isNullable: true,
        }),
      }
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('staff', [
        {
          oldColumn: new TableColumn({
            name: 'state_id',
            type: 'integer',
            isNullable: true,
          }),
          newColumn: new TableColumn({
            name: 'state_id',
            type: 'integer',
            isNullable: false,
          }),
        },
        {
          oldColumn: new TableColumn({
            name: 'organization_id',
            type: 'integer',
            isNullable: true,
          }),
          newColumn: new TableColumn({
            name: 'organization_id',
            type: 'integer',
            isNullable: false,
          }),
        },
        {
          oldColumn: new TableColumn({
            name: 'role_id',
            type: 'integer',
            isNullable: true,
          }),
          newColumn: new TableColumn({
            name: 'role_id',
            type: 'integer',
            isNullable: false,
          }),
        }
      ]);
  }
}
