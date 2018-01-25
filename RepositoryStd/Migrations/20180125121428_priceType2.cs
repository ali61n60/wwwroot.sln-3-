using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class priceType2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Price_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Price",
                schema: "ad",
                table: "Price");

            migrationBuilder.RenameTable(
                name: "Price",
                schema: "ad",
                newName: "FixedPrices");

            migrationBuilder.RenameColumn(
                name: "price",
                schema: "ad",
                table: "FixedPrices",
                newName: "priceAmount");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FixedPrices",
                schema: "ad",
                table: "FixedPrices",
                column: "adId");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_FixedPrices_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                column: "FixedPriceAdId",
                principalSchema: "ad",
                principalTable: "FixedPrices",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_FixedPrices_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FixedPrices",
                schema: "ad",
                table: "FixedPrices");

            migrationBuilder.RenameTable(
                name: "FixedPrices",
                schema: "ad",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "priceAmount",
                schema: "ad",
                table: "Price",
                newName: "price");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Price",
                schema: "ad",
                table: "Price",
                column: "adId");

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
    }
}
