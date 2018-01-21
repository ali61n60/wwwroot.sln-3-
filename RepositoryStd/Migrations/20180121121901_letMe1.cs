using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace RepositoryStd.Migrations
{
    public partial class letMe1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "identity");

            //migrationBuilder.RenameTable(
            //    name: "AspNetUsers",
            //    schema: "ad",
            //    newSchema: "identity");

            migrationBuilder.CreateTable(
                name: "LetMeKnow",
                schema: "ad",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    categoryId = table.Column<int>(nullable: false),
                    userId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Id", x => x.id);
                    table.ForeignKey(
                        name: "FK_LetMeKnows_Categories",
                        column: x => x.categoryId,
                        principalSchema: "ad",
                        principalTable: "Categories",
                        principalColumn: "categoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LetMeKnows_AspNetUsers",
                        column: x => x.userId,
                        principalSchema: "identity",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnow_categoryId",
                schema: "ad",
                table: "LetMeKnow",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_LetMeKnow_userId",
                schema: "ad",
                table: "LetMeKnow",
                column: "userId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LetMeKnow",
                schema: "ad");

            //migrationBuilder.RenameTable(
            //    name: "AspNetUsers",
            //    schema: "identity",
            //    newSchema: "ad");
        }
    }
}
