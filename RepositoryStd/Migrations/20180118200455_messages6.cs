using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace RepositoryStd.Migrations
{
    public partial class messages6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "Messages",
            //    schema: "ad");

            migrationBuilder.CreateTable(
                name: "EmailMessages",
                schema: "ad",
                columns: table => new
                {
                    messageId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    emailAddress = table.Column<string>(maxLength: 300, nullable: false),
                    messageDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    messagePriority = table.Column<int>(type: "int", nullable: false),
                    sent = table.Column<bool>(nullable: false),
                    subject = table.Column<string>(maxLength: 300, nullable: false),
                    textMessage = table.Column<string>(maxLength: 1000, nullable: false),
                    titleMessage = table.Column<string>(maxLength: 100, nullable: false),
                    userId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailMessage", x => x.messageId);
                    table.ForeignKey(
                        name: "FK_EmailMessages_AspNetUsers_userId",
                        column: x => x.userId,
                        principalSchema: "identity",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            //migrationBuilder.CreateTable(
            //    name: "SmsMessages",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        messageId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        messageDate = table.Column<DateTime>(type: "datetime", nullable: false),
            //        messagePriority = table.Column<int>(type: "int", nullable: false),
            //        sent = table.Column<bool>(nullable: false),
            //        textMessage = table.Column<string>(maxLength: 1000, nullable: false),
            //        userId = table.Column<string>(maxLength: 450, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_SmsMessage", x => x.messageId);
            //        table.ForeignKey(
            //            name: "FK_SmsMessages_AspNetUsers_userId",
            //            column: x => x.userId,
            //            principalSchema: "ad",
            //            principalTable: "AspNetUsers",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessages_userId",
                schema: "ad",
                table: "EmailMessages",
                column: "userId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_SmsMessages_userId",
            //    schema: "ad",
            //    table: "SmsMessages",
            //    column: "userId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailMessages",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "SmsMessages",
                schema: "ad");

            migrationBuilder.CreateTable(
                name: "Messages",
                schema: "ad",
                columns: table => new
                {
                    messageId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    emailOrSms = table.Column<int>(type: "int", nullable: false),
                    messageDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    messagePriority = table.Column<int>(type: "int", nullable: false),
                    sent = table.Column<bool>(nullable: false),
                    textMessage = table.Column<string>(maxLength: 1000, nullable: false),
                    userId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.messageId);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_userId",
                        column: x => x.userId,
                        principalSchema: "ad",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_userId",
                schema: "ad",
                table: "Messages",
                column: "userId");
        }
    }
}
