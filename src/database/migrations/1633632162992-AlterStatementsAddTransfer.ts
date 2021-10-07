import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterStatementsAddTransfer1633632162992
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "receiver_id",
        type: "uuid",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "sender_id");
    await queryRunner.dropColumn("statements", "receiver_id");
  }
}
