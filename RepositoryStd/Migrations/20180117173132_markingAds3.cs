using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class markingAds3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_SimilarAds_adId",
                schema: "ad",
                table: "SimilarAds");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AdPrivilege_adId",
                schema: "ad",
                table: "AdPrivilege");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_SimilarAds_adId",
                schema: "ad",
                table: "SimilarAds",
                column: "adId");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AdPrivilege_adId",
                schema: "ad",
                table: "AdPrivilege",
                column: "adId");
        }
    }
}
