using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class priceType1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price");

            migrationBuilder.DropColumn(
                name: "priceType",
                schema: "ad",
                table: "Price");

            migrationBuilder.AddColumn<Guid>(
                name: "FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "priceType",
                schema: "ad",
                table: "Advertisements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "price",
                schema: "ad",
                table: "Price",
                type: "money",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "money",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                column: "FixedPriceAdId");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedPrice_Advertisements",
                schema: "ad",
                table: "Price",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Price_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                column: "FixedPriceAdId",
                principalSchema: "ad",
                principalTable: "Price",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedPrice_Advertisements",
                schema: "ad",
                table: "Price");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Price_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropIndex(
                name: "IX_Advertisements_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "FixedPriceAdId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "priceType",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.AlterColumn<decimal>(
                name: "price",
                schema: "ad",
                table: "Price",
                type: "money",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "money");

            migrationBuilder.AddColumn<string>(
                name: "priceType",
                schema: "ad",
                table: "Price",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
