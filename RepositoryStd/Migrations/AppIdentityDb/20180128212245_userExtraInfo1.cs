using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations.AppIdentityDb
{
    public partial class userExtraInfo1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailAddressVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstNameEx",
                schema: "identity",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastNameEx",
                schema: "identity",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumberVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailAddressVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FirstNameEx",
                schema: "identity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastNameEx",
                schema: "identity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PhoneNumberVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers");
        }
    }
}
