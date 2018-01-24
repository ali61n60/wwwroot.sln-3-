using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class temperature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "temp",
                schema: "ad",
                table: "Temperatures",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<double>(
                name: "humidity",
                schema: "ad",
                table: "Temperatures",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "viewPoint",
                schema: "ad",
                table: "Temperatures",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "humidity",
                schema: "ad",
                table: "Temperatures");

            migrationBuilder.DropColumn(
                name: "viewPoint",
                schema: "ad",
                table: "Temperatures");

            migrationBuilder.AlterColumn<int>(
                name: "temp",
                schema: "ad",
                table: "Temperatures",
                nullable: false,
                oldClrType: typeof(double));
        }
    }
}
