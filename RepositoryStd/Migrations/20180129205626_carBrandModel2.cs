using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class carBrandModel2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_CarModel",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdAttributeTransportation",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.RenameTable(
                name: "LetMeKnowAttributeTransportaion",
                schema: "ad",
                newName: "LetMeKnowAttributeTransportaions");

            migrationBuilder.RenameTable(
                name: "LetMeKnow",
                schema: "ad",
                newName: "LetMeKnows");

            migrationBuilder.RenameTable(
                name: "CarModel",
                schema: "ad",
                newName: "CarModels");

            migrationBuilder.RenameTable(
                name: "AdAttributeTransportation",
                schema: "ad",
                newName: "AdAttributeTransportations");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnowAttributeTransportaion_modelId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaions",
            //    newName: "IX_LetMeKnowAttributeTransportaions_modelId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnowAttributeTransportaion_brandId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaions",
            //    newName: "IX_LetMeKnowAttributeTransportaions_brandId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnow_userId",
            //    schema: "ad",
            //    table: "LetMeKnows",
            //    newName: "IX_LetMeKnows_userId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnow_categoryId",
            //    schema: "ad",
            //    table: "LetMeKnows",
            //    newName: "IX_LetMeKnows_categoryId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_CarModel_brandId",
            //    schema: "ad",
            //    table: "CarModels",
            //    newName: "IX_CarModels_brandId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_AdAttributeTransportation_modelId",
            //    schema: "ad",
            //    table: "AdAttributeTransportations",
            //    newName: "IX_AdAttributeTransportations_modelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdAttributeTransportations",
                schema: "ad",
                table: "AdAttributeTransportations",
                column: "adId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportations_CarModels",
                schema: "ad",
                table: "AdAttributeTransportations",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModels",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportations_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportations",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportations_CarModels",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportations_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AdAttributeTransportations",
                schema: "ad",
                table: "AdAttributeTransportations");

            migrationBuilder.RenameTable(
                name: "LetMeKnowAttributeTransportaions",
                schema: "ad",
                newName: "LetMeKnowAttributeTransportaion");

            migrationBuilder.RenameTable(
                name: "LetMeKnows",
                schema: "ad",
                newName: "LetMeKnow");

            migrationBuilder.RenameTable(
                name: "CarModels",
                schema: "ad",
                newName: "CarModel");

            migrationBuilder.RenameTable(
                name: "AdAttributeTransportations",
                schema: "ad",
                newName: "AdAttributeTransportation");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnowAttributeTransportaions_modelId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaion",
            //    newName: "IX_LetMeKnowAttributeTransportaion_modelId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnowAttributeTransportaions_brandId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaion",
            //    newName: "IX_LetMeKnowAttributeTransportaion_brandId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnows_userId",
            //    schema: "ad",
            //    table: "LetMeKnow",
            //    newName: "IX_LetMeKnow_userId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_LetMeKnows_categoryId",
            //    schema: "ad",
            //    table: "LetMeKnow",
            //    newName: "IX_LetMeKnow_categoryId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_CarModels_brandId",
            //    schema: "ad",
            //    table: "CarModel",
            //    newName: "IX_CarModel_brandId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_AdAttributeTransportations_modelId",
            //    schema: "ad",
            //    table: "AdAttributeTransportation",
            //    newName: "IX_AdAttributeTransportation_modelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdAttributeTransportation",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_CarModel",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_Advertisements",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "adId",
                principalSchema: "ad",
                principalTable: "Advertisements",
                principalColumn: "adId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
