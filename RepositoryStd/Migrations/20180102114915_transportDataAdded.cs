using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class transportDataAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_CarModel_modelId",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.AddColumn<string>(
                name: "carStatus",
                schema: "ad",
                table: "AdAttributeTransportation",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "plateType",
                schema: "ad",
                table: "AdAttributeTransportation",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_CarBrands",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_CarBrands",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropColumn(
                name: "carStatus",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropColumn(
                name: "plateType",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_CarModel_modelId",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
