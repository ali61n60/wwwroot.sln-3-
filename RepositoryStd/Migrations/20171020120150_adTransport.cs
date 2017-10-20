using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class adTransport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements_adId",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_AdPrivilege_Advertisements_adId",
                schema: "ad",
                table: "AdPrivilege");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdAttributeCar",
                schema: "ad",
                table: "AdAttributeTransportation");

            //migrationBuilder.DropIndex(
            //    name: "IX_AdAttributeTransportation_adId",
            //    schema: "ad",
            //    table: "AdAttributeTransportation");

            migrationBuilder.DropColumn(
                name: "WhatIsSheDoing",
                schema: "ad",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "attributeId",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdAttributeTransportation",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId");

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
                table: "Advertisements",
                column: "adId",
                principalSchema: "ad",
                principalTable: "AdAttributeTransportation",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);
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
                table: "Advertisements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdAttributeTransportation",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.AddColumn<int>(
                name: "WhatIsSheDoing",
                schema: "ad",
                table: "Advertisements",
                nullable: false,
                defaultValueSql: "0");

            migrationBuilder.AddColumn<Guid>(
                name: "attributeId",
                schema: "ad",
                table: "AdAttributeTransportation",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdAttributeCar",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "attributeId");

            migrationBuilder.CreateIndex(
                name: "IX_AdAttributeTransportation_adId",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements_adId",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdPrivilege_Advertisements_adId",
                schema: "ad",
                table: "AdPrivilege",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
