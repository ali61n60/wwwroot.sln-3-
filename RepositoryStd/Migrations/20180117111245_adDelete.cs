using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class adDelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_AdPrivilage_Advertisements",
            //    schema: "ad",
            //    table: "AdPrivilege");

            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Districts",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Cities_Provinces",
                schema: "ad",
                table: "Cities");

            migrationBuilder.DropForeignKey(
                name: "FK_AdPrivilage_Advertisements",
                schema: "ad",
                table: "AdPrivilege");

            migrationBuilder.DropForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price");

            migrationBuilder.DropForeignKey(
                name: "FK_SimilarAds_Advertisements",
                schema: "ad",
                table: "SimilarAds");

            migrationBuilder.AlterColumn<string>(
                name: "provinceCenter",
                schema: "ad",
                table: "Provinces",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "provinceId",
                schema: "ad",
                table: "Cities",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AdPrivilage_Advertisements",
                schema: "ad",
                table: "AdPrivilege",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Districts",
                schema: "ad",
                table: "Advertisements",
                column: "districtId",
                principalSchema: "ad",
                principalTable: "Districts",
                principalColumn: "districtId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Cities_Provinces",
                schema: "ad",
                table: "Cities",
                column: "provinceId",
                principalSchema: "ad",
                principalTable: "Provinces",
                principalColumn: "provinceId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SimilarAds_Advertisements",
                schema: "ad",
                table: "SimilarAds",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdPrivilage_Advertisements",
                schema: "ad",
                table: "AdPrivilege");

            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Districts",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropForeignKey(
                name: "FK_Cities_Provinces",
                schema: "ad",
                table: "Cities");

            migrationBuilder.DropForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price");

            migrationBuilder.DropForeignKey(
                name: "FK_SimilarAds_Advertisements",
                schema: "ad",
                table: "SimilarAds");

            migrationBuilder.AlterColumn<string>(
                name: "provinceCenter",
                schema: "ad",
                table: "Provinces",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<int>(
                name: "provinceId",
                schema: "ad",
                table: "Cities",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_AdPrivilage_Advertisements",
                schema: "ad",
                table: "AdPrivilege",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Districts",
                schema: "ad",
                table: "Advertisements",
                column: "districtId",
                principalSchema: "ad",
                principalTable: "Districts",
                principalColumn: "districtId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Cities_Provinces",
                schema: "ad",
                table: "Cities",
                column: "provinceId",
                principalSchema: "ad",
                principalTable: "Provinces",
                principalColumn: "provinceId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Price_Advertisements",
                schema: "ad",
                table: "Price",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SimilarAds_Advertisements",
                schema: "ad",
                table: "SimilarAds",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
