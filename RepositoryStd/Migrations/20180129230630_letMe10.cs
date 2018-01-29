using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letMe10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModels");

            //migrationBuilder.DropIndex(
            //    name: "IX_LetMeKnowAttributeTransportaions_brandId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaions");

            //migrationBuilder.DropIndex(
            //    name: "IX_LetMeKnowAttributeTransportaions_modelId",
            //    schema: "ad",
            //    table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaions_brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "brandId");

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaions_modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "modelId");

            migrationBuilder.AddForeignKey(
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModels",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModels");

            migrationBuilder.DropIndex(
                name: "IX_LetMeKnowAttributeTransportaions_brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.DropIndex(
                name: "IX_LetMeKnowAttributeTransportaions_modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaions_brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "brandId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaions_modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "modelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModels",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
