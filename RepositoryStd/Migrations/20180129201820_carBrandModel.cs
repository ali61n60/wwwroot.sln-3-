using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class carBrandModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_CarBrands",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_CarBrands_Makers",
                schema: "ad",
                table: "CarModel");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CarBrand",
                schema: "ad",
                table: "CarModel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CarMakers",
                schema: "ad",
                table: "Brands");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarModel",
                schema: "ad",
                table: "CarModel",
                column: "modelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarBrand",
                schema: "ad",
                table: "Brands",
                column: "brandId");

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
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModel",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdAttributeTransportation_CarModel",
                schema: "ad",
                table: "AdAttributeTransportation");

            migrationBuilder.DropForeignKey(
                name: "FK_CarModel_CarBrand",
                schema: "ad",
                table: "CarModel");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion");

            migrationBuilder.DropForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel1",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CarModel",
                schema: "ad",
                table: "CarModel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CarBrand",
                schema: "ad",
                table: "Brands");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarBrand",
                schema: "ad",
                table: "CarModel",
                column: "modelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CarMakers",
                schema: "ad",
                table: "Brands",
                column: "brandId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdAttributeTransportation_CarBrands",
                schema: "ad",
                table: "AdAttributeTransportation",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CarBrands_Makers",
                schema: "ad",
                table: "CarModel",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_Brand",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "brandId",
                principalSchema: "ad",
                principalTable: "Brands",
                principalColumn: "brandId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LetMeKnowAttributeTransportaion_CarModel",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "modelId",
                principalSchema: "ad",
                principalTable: "CarModel",
                principalColumn: "modelId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
