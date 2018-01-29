using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations.AppIdentityDb
{
    public partial class userExtra2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumberVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                newName: "PhoneNumberConfirmCodeEx");

            migrationBuilder.RenameColumn(
                name: "EmailAddressVerifyCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                newName: "EmailAddressConfirmCodeEx");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumberConfirmCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                newName: "PhoneNumberVerifyCodeEx");

            migrationBuilder.RenameColumn(
                name: "EmailAddressConfirmCodeEx",
                schema: "identity",
                table: "AspNetUsers",
                newName: "EmailAddressVerifyCodeEx");
        }
    }
}
