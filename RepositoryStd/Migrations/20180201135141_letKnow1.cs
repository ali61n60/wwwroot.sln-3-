using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letKnow1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "fromYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "toYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fromYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");

            migrationBuilder.DropColumn(
                name: "toYear",
                schema: "ad",
                table: "LetMeKnowAttributeTransportaions");
        }
    }
}
