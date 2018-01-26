using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class price6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<int>(
            //    name: "categoryParentId",
            //    schema: "ad",
            //    table: "Categories",
            //    nullable: false,
            //    oldClrType: typeof(int),
            //    oldType: "nchar(10)");

            migrationBuilder.CreateTable(
                name: "AgreementPrices",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgreementPrices", x => x.adId);
                    table.ForeignKey(
                        name: "FK_AgreementPrices_Advertisements_adId",
                        column: x => x.adId,
                        principalSchema: "ad",
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExchangePrice",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExchangePrice", x => x.adId);
                    table.ForeignKey(
                        name: "FK_ExchangePrice_Advertisements_adId",
                        column: x => x.adId,
                        principalSchema: "ad",
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InstallmentPrice",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    numberOfInstallments = table.Column<int>(nullable: false),
                    PayPerInstallment = table.Column<decimal>(type: "money", nullable: false),
                    Plan = table.Column<int>(nullable: false),
                    prepayment = table.Column<decimal>(type: "money", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallmentPrice", x => x.adId);
                    table.ForeignKey(
                        name: "FK_InstallmentPrice_Advertisements_adId",
                        column: x => x.adId,
                        principalSchema: "ad",
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MortgageAndRentPrice",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    mortgage = table.Column<decimal>(type: "money", nullable: false),
                    rentPayMonth = table.Column<decimal>(type: "money", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MortgageAndRentPrice", x => x.adId);
                    table.ForeignKey(
                        name: "FK_MortgageAndRentPrice_Advertisements_adId",
                        column: x => x.adId,
                        principalSchema: "ad",
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgreementPrices",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ExchangePrice",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "InstallmentPrice",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "MortgageAndRentPrice",
                schema: "ad");

            //migrationBuilder.AlterColumn<int>(
            //    name: "categoryParentId",
            //    schema: "ad",
            //    table: "Categories",
            //    type: "nchar(10)",
            //    nullable: false,
            //    oldClrType: typeof(int));
        }
    }
}
