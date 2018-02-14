using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class modelChange1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fuel",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.DropColumn(
                name: "gearbox",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.AlterColumn<int>(
                name: "plateType",
                schema: "ad",
                table: "AdAttributeTransportations",
                nullable: false,
                defaultValue:4,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "carStatus",
                schema: "ad",
                table: "AdAttributeTransportations",
                nullable: false,
                defaultValue: 4,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "bodyStatus",
                schema: "ad",
                table: "AdAttributeTransportations",
                nullable: false,
                defaultValue: 13,
                oldClrType: typeof(string),
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "fuelType",
                schema: "ad",
                table: "AdAttributeTransportations",
                nullable: false,
                defaultValue: 7);

            migrationBuilder.AddColumn<int>(
                name: "gearboxType",
                schema: "ad",
                table: "AdAttributeTransportations",
                nullable: false,
                defaultValue: 3);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fuelType",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.DropColumn(
                name: "gearboxType",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.AlterColumn<string>(
                name: "plateType",
                schema: "ad",
                table: "AdAttributeTransportations",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "carStatus",
                schema: "ad",
                table: "AdAttributeTransportations",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "bodyStatus",
                schema: "ad",
                table: "AdAttributeTransportations",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<string>(
                name: "fuel",
                schema: "ad",
                table: "AdAttributeTransportations",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gearbox",
                schema: "ad",
                table: "AdAttributeTransportations",
                maxLength: 50,
                nullable: true);
        }
    }
}
