using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class approvedAd1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.RenameColumn(
            //    name: "RequestInsertDateTime",
            //    schema: "ad",
            //    table: "LetMeKnow",
            //    newName: "requestInsertDateTime");

            migrationBuilder.CreateTable(
                name: "ApprovedAds",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    approvedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    managedByAdmin = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovedAd", x => x.adId);
                    table.ForeignKey(
                        name: "FK_ApprovedAd_Advertisements",
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
                name: "ApprovedAds",
                schema: "ad");

            //migrationBuilder.RenameColumn(
            //    name: "requestInsertDateTime",
            //    schema: "ad",
            //    table: "LetMeKnow",
            //    newName: "RequestInsertDateTime");
        }
    }
}
