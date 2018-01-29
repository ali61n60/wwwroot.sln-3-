using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letMe11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModels",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModels",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
