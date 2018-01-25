using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class adStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_AdTypes",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropTable(
                name: "AdStatus",
                schema: "ad");

            //migrationBuilder.DropIndex(
            //    name: "IX_Advertisements_adStatusId",
            //    schema: "ad",
            //    table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "adStatusId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.AddColumn<int>(
                name: "adStatus",
                schema: "ad",
                table: "Advertisements",
                nullable: false,
                defaultValue: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "adStatus",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.AddColumn<int>(
                name: "adStatusId",
                schema: "ad",
                table: "Advertisements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AdStatus",
                schema: "ad",
                columns: table => new
                {
                    adStatusId = table.Column<int>(nullable: false),
                    adStatus = table.Column<string>(maxLength: 150, nullable: false),
                    adStatusEnglish = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdStatus", x => x.adStatusId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_adStatusId",
                schema: "ad",
                table: "Advertisements",
                column: "adStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_AdTypes",
                schema: "ad",
                table: "Advertisements",
                column: "adStatusId",
                principalSchema: "ad",
                principalTable: "AdStatus",
                principalColumn: "adStatusId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
