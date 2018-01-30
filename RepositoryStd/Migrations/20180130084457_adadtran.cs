using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class adadtran : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "categoryId",
                schema: "ad",
                table: "LetMeKnows",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "categoryId",
                schema: "ad",
                table: "LetMeKnows",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
