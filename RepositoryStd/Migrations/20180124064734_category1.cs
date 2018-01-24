using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class category1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<int>(
            //    name: "categoryParentId",
            //    schema: "ad",
            //    table: "Categories",
            //    type: "nchar(10)",
            //    nullable: false,
            //    oldClrType: typeof(string),
            //    oldType: "nchar(10)",
            //    oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterColumn<string>(
            //    name: "categoryParentId",
            //    schema: "ad",
            //    table: "Categories",
            //    type: "nchar(10)",
            //    nullable: true,
            //    oldClrType: typeof(int),
            //    oldType: "nchar(10)");
        }
    }
}
