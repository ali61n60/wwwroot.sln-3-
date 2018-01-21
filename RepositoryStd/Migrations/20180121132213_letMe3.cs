using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class letMe3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "requestInsertDateTime",
                schema: "ad",
                table: "LetMeKnow",
                type: "smalldatetime",
                nullable: false
                //defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                );

            migrationBuilder.AddColumn<int>(
                name: "requetsPrivilege",
                schema: "ad",
                table: "LetMeKnow",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "requestInsertDateTime",
                schema: "ad",
                table: "LetMeKnow");

            migrationBuilder.DropColumn(
                name: "requetsPrivilege",
                schema: "ad",
                table: "LetMeKnow");
        }
    }
}
