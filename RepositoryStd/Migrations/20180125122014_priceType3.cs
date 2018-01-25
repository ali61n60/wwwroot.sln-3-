using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class priceType3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_FixedPrices_FixedPriceAdId",
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_FixedPriceAdId",
                schema: "ad",
                table: "Advertisements",
                column: "FixedPriceAdId");

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
    }
}
