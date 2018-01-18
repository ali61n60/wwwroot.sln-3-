using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class messages3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "phoneNumber",
                schema: "ad",
                table: "Messages");

            migrationBuilder.AlterColumn<string>(
                name: "textMessage",
                schema: "ad",
                table: "Messages",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 256);

            migrationBuilder.AddColumn<int>(
                name: "emailOrSms",
                schema: "ad",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "messagePriority",
                schema: "ad",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "userId",
                schema: "ad",
                table: "Messages",
                maxLength: 450,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "emailOrSms",
                schema: "ad",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "messagePriority",
                schema: "ad",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "userId",
                schema: "ad",
                table: "Messages");

            migrationBuilder.AlterColumn<string>(
                name: "textMessage",
                schema: "ad",
                table: "Messages",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 1000);

            migrationBuilder.AddColumn<string>(
                name: "phoneNumber",
                schema: "ad",
                table: "Messages",
                maxLength: 256,
                nullable: false,
                defaultValue: "");
        }
    }
}
