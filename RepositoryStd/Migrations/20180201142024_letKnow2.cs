using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letKnow2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "toYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                newName: "makeYearto");

            migrationBuilder.RenameColumn(
                name: "fromYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                newName: "makeYearFrom");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "makeYearto",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                newName: "toYear");

            migrationBuilder.RenameColumn(
                name: "makeYearFrom",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                newName: "fromYear");
        }
    }
}
