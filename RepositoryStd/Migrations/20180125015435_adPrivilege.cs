using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class adPrivilege : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdPrivilege_Privilege",
                schema: "ad",
                table: "AdPrivilege");

            migrationBuilder.DropTable(
                name: "Privilege",
                schema: "ad");

            //migrationBuilder.DropIndex(
            //    name: "IX_AdPrivilege_privilegeId",
            //    schema: "ad",
            //    table: "AdPrivilege");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Privilege",
                schema: "ad",
                columns: table => new
                {
                    privilegeId = table.Column<int>(nullable: false),
                    privilegeName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Privilege", x => x.privilegeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdPrivilege_privilegeId",
                schema: "ad",
                table: "AdPrivilege",
                column: "privilegeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdPrivilege_Privilege",
                schema: "ad",
                table: "AdPrivilege",
                column: "privilegeId",
                principalSchema: "ad",
                principalTable: "Privilege",
                principalColumn: "privilegeId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
