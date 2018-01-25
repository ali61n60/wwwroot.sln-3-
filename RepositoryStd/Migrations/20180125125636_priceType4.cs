using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class priceType4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedPrice_Advertisements",
                schema: "ad",
                table: "FixedPrices");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedPrices_Advertisements_adId",
                schema: "ad",
                table: "FixedPrices",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedPrices_Advertisements_adId",
                schema: "ad",
                table: "FixedPrices");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedPrice_Advertisements",
                schema: "ad",
                table: "FixedPrices",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
