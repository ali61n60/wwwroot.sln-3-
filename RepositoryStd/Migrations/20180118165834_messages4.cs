using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class messages4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Messages_userId",
                schema: "ad",
                table: "Messages",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_userId",
                schema: "ad",
                table: "Messages",
                column: "userId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_userId",
                schema: "ad",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_userId",
                schema: "ad",
                table: "Messages");
        }
    }
}
