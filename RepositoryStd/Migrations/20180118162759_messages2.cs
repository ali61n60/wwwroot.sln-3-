using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class messages2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SMS",
                schema: "ad",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "message",
                schema: "ad",
                table: "Messages",
                newName: "textMessage");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Message",
                schema: "ad",
                table: "Messages",
                column: "messageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Message",
                schema: "ad",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "textMessage",
                schema: "ad",
                table: "Messages",
                newName: "message");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SMS",
                schema: "ad",
                table: "Messages",
                column: "messageId");
        }
    }
}
