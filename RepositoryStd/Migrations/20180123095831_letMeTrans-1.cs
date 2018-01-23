using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letMeTrans1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LetMeKnowAttributeTransportaion",
                schema: "ad",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false),
                    brandId = table.Column<int>(nullable: false),
                    modelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LetMeKnowAttributeTransportaion", x => x.id);
                    table.ForeignKey(
                        name: "FK_LetMeKnowAttributeTransportaion_Brand",
                        column: x => x.brandId,
                        principalSchema: "ad",
                        principalTable: "Brands",
                        principalColumn: "brandId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LetMeKnowAttributeTransportaion_LetMeKnow",
                        column: x => x.id,
                        principalSchema: "ad",
                        principalTable: "LetMeKnow",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LetMeKnowAttributeTransportaion_CarModel",
                        column: x => x.modelId,
                        principalSchema: "ad",
                        principalTable: "CarModel",
                        principalColumn: "modelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaion_brandId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "brandId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnowAttributeTransportaion_modelId",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaion",
                column: "modelId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LetMeKnowAttributeTransportaion",
                schema: "ad");
        }
    }
}
