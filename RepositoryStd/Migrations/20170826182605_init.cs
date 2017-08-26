using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace RepositoryStd.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdStatus",
                columns: table => new
                {
                    adStatusId = table.Column<int>(nullable: false),
                    adStatus = table.Column<string>(maxLength: 150, nullable: false),
                    adStatusEnglish = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdStatus", x => x.adStatusId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 450, nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 450, nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(maxLength: 450, nullable: false),
                    LoginProvider = table.Column<string>(maxLength: 450, nullable: false),
                    Name = table.Column<string>(maxLength: 450, nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    brandId = table.Column<int>(nullable: false),
                    brandName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarMakers", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    categoryId = table.Column<int>(nullable: false),
                    categoryName = table.Column<string>(maxLength: 150, nullable: false),
                    categoryNameEnglish = table.Column<string>(maxLength: 150, nullable: true),
                    categoryParentId = table.Column<string>(type: "nchar(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.categoryId);
                });

            migrationBuilder.CreateTable(
                name: "MobileBrands",
                columns: table => new
                {
                    brandId = table.Column<int>(nullable: false),
                    brandMakerId = table.Column<int>(nullable: false),
                    brandName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobileBrands", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "Privilege",
                columns: table => new
                {
                    privilegeId = table.Column<int>(nullable: false),
                    privilegeName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Privilege", x => x.privilegeId);
                });

            migrationBuilder.CreateTable(
                name: "Provinces",
                columns: table => new
                {
                    provinceId = table.Column<int>(nullable: false),
                    provinceCenter = table.Column<string>(maxLength: 150, nullable: true),
                    provinceName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provinces", x => x.provinceId);
                });

            migrationBuilder.CreateTable(
                name: "SMS",
                columns: table => new
                {
                    messageId = table.Column<Guid>(nullable: false),
                    message = table.Column<string>(maxLength: 256, nullable: false),
                    messageDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    phoneNumber = table.Column<string>(maxLength: 256, nullable: false),
                    sent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SMS", x => x.messageId);
                });

            migrationBuilder.CreateTable(
                name: "Test",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Test", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "test2",
                columns: table => new
                {
                    id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(type: "nchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_test2", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Test3",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Test3", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Test4",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    name = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Test4", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UsersExtraInfo",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    emailAddress = table.Column<string>(maxLength: 256, nullable: false),
                    emailAddressVerified = table.Column<bool>(nullable: false),
                    emailAddressVerifyCode = table.Column<string>(maxLength: 50, nullable: true),
                    phoneNumber = table.Column<string>(maxLength: 16, nullable: false),
                    phoneNumberVerified = table.Column<bool>(nullable: false),
                    phoneNumberVerifyCode = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("UQ__UsersExt__1788CC4DE633CBD7", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(maxLength: 450, nullable: false),
                    ProviderKey = table.Column<string>(maxLength: 450, nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(maxLength: 450, nullable: false),
                    RoleId = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CarModel",
                columns: table => new
                {
                    modelId = table.Column<int>(nullable: false),
                    brandId = table.Column<int>(nullable: false),
                    modelName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarBrand", x => x.modelId);
                    table.ForeignKey(
                        name: "FK_CarBrands_Makers",
                        column: x => x.brandId,
                        principalTable: "Brands",
                        principalColumn: "brandId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    cityId = table.Column<int>(nullable: false),
                    cityName = table.Column<string>(maxLength: 150, nullable: false),
                    provinceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.cityId);
                    table.ForeignKey(
                        name: "FK_Cities_Provinces_provinceId",
                        column: x => x.provinceId,
                        principalTable: "Provinces",
                        principalColumn: "provinceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    districtId = table.Column<int>(nullable: false),
                    cityId = table.Column<int>(nullable: false),
                    districtName = table.Column<string>(maxLength: 150, nullable: false),
                    municipalId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Districts", x => x.districtId);
                    table.ForeignKey(
                        name: "FK_Districts_Cities",
                        column: x => x.cityId,
                        principalTable: "Cities",
                        principalColumn: "cityId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Advertisements",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    adComments = table.Column<string>(maxLength: 1000, nullable: false),
                    adInsertDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    adLink = table.Column<string>(maxLength: 500, nullable: false),
                    adNumberOfVisited = table.Column<int>(nullable: false),
                    adStatusId = table.Column<int>(nullable: false),
                    adTitle = table.Column<string>(maxLength: 250, nullable: false),
                    categoryId = table.Column<int>(nullable: false),
                    districtId = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Advertisements_1", x => x.adId);
                    table.ForeignKey(
                        name: "FK_Advertisements_AdTypes",
                        column: x => x.adStatusId,
                        principalTable: "AdStatus",
                        principalColumn: "adStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Advertisements_Categories_categoryId",
                        column: x => x.categoryId,
                        principalTable: "Categories",
                        principalColumn: "categoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Advertisements_Districts_districtId",
                        column: x => x.districtId,
                        principalTable: "Districts",
                        principalColumn: "districtId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AdAttributeTransportation",
                columns: table => new
                {
                    attributeId = table.Column<Guid>(nullable: false),
                    adId = table.Column<Guid>(nullable: false),
                    bodyColor = table.Column<string>(maxLength: 50, nullable: true),
                    bodyStatus = table.Column<string>(maxLength: 50, nullable: true),
                    fuel = table.Column<string>(maxLength: 50, nullable: true),
                    gearbox = table.Column<string>(maxLength: 50, nullable: true),
                    internalColor = table.Column<string>(maxLength: 50, nullable: true),
                    makeYear = table.Column<int>(nullable: true),
                    mileage = table.Column<int>(nullable: true),
                    modelId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdAttributeCar", x => x.attributeId);
                    table.ForeignKey(
                        name: "FK_AdAttributeTransportation_Advertisements_adId",
                        column: x => x.adId,
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdAttributeTransportation_CarModel_modelId",
                        column: x => x.modelId,
                        principalTable: "CarModel",
                        principalColumn: "modelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AdPrivilege",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    privilegeId = table.Column<int>(nullable: false),
                    insertionDate = table.Column<DateTime>(type: "smalldatetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdPrivilage", x => new { x.adId, x.privilegeId, x.insertionDate });
                    table.ForeignKey(
                        name: "FK_AdPrivilege_Advertisements_adId",
                        column: x => x.adId,
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdPrivilege_Privilege",
                        column: x => x.privilegeId,
                        principalTable: "Privilege",
                        principalColumn: "privilegeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Price",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    price = table.Column<decimal>(type: "money", nullable: true),
                    priceType = table.Column<string>(maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price", x => x.adId);
                    table.ForeignKey(
                        name: "FK_Price_Advertisements",
                        column: x => x.adId,
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SimilarAds",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    similarAdId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimilarAds", x => new { x.adId, x.similarAdId });
                    table.ForeignKey(
                        name: "FK_SimilarAds_Advertisements",
                        column: x => x.adId,
                        principalTable: "Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdAttributeTransportation_adId",
                table: "AdAttributeTransportation",
                column: "adId");

            migrationBuilder.CreateIndex(
                name: "IX_AdAttributeTransportation_modelId",
                table: "AdAttributeTransportation",
                column: "modelId");

            migrationBuilder.CreateIndex(
                name: "IX_AdPrivilege_privilegeId",
                table: "AdPrivilege",
                column: "privilegeId");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_adStatusId",
                table: "Advertisements",
                column: "adStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_categoryId",
                table: "Advertisements",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_districtId",
                table: "Advertisements",
                column: "districtId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CarModel_brandId",
                table: "CarModel",
                column: "brandId");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_provinceId",
                table: "Cities",
                column: "provinceId");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_cityId",
                table: "Districts",
                column: "cityId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdAttributeTransportation");

            migrationBuilder.DropTable(
                name: "AdPrivilege");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "MobileBrands");

            migrationBuilder.DropTable(
                name: "Price");

            migrationBuilder.DropTable(
                name: "SimilarAds");

            migrationBuilder.DropTable(
                name: "SMS");

            migrationBuilder.DropTable(
                name: "Test");

            migrationBuilder.DropTable(
                name: "test2");

            migrationBuilder.DropTable(
                name: "Test3");

            migrationBuilder.DropTable(
                name: "Test4");

            migrationBuilder.DropTable(
                name: "UsersExtraInfo");

            migrationBuilder.DropTable(
                name: "CarModel");

            migrationBuilder.DropTable(
                name: "Privilege");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Advertisements");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropTable(
                name: "AdStatus");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Districts");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "Provinces");
        }
    }
}
