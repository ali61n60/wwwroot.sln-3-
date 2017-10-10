using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "ad");

            migrationBuilder.CreateTable(
                name: "ad.AdStatus",
                schema: "ad",
                columns: table => new
                {
                    adStatusId = table.Column<int>(nullable: false),
                    adStatus = table.Column<string>(maxLength: 150, nullable: false),
                    adStatusEnglish = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.AdStatus", x => x.adStatusId);
                });

            migrationBuilder.CreateTable(
                name: "ad.Brands",
                schema: "ad",
                columns: table => new
                {
                    brandId = table.Column<int>(nullable: false),
                    brandName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Brands", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "ad.Categories",
                schema: "ad",
                columns: table => new
                {
                    categoryId = table.Column<int>(nullable: false),
                    categoryName = table.Column<string>(maxLength: 150, nullable: false),
                    categoryNameEnglish = table.Column<string>(maxLength: 150, nullable: true),
                    categoryParentId = table.Column<string>(maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Categories", x => x.categoryId);
                });

            migrationBuilder.CreateTable(
                name: "ad.MobileBrands",
                schema: "ad",
                columns: table => new
                {
                    brandId = table.Column<int>(nullable: false),
                    brandMakerId = table.Column<int>(nullable: false),
                    brandName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.MobileBrands", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "ad.Privilege",
                schema: "ad",
                columns: table => new
                {
                    privilegeId = table.Column<int>(nullable: false),
                    privilegeName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Privilege", x => x.privilegeId);
                });

            migrationBuilder.CreateTable(
                name: "ad.Provinces",
                schema: "ad",
                columns: table => new
                {
                    provinceId = table.Column<int>(nullable: false),
                    provinceCenter = table.Column<string>(maxLength: 150, nullable: true),
                    provinceName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Provinces", x => x.provinceId);
                });

            migrationBuilder.CreateTable(
                name: "ad.SMS",
                schema: "ad",
                columns: table => new
                {
                    messageId = table.Column<Guid>(nullable: false),
                    message = table.Column<string>(maxLength: 256, nullable: false),
                    messageDate = table.Column<DateTime>(nullable: false),
                    phoneNumber = table.Column<string>(maxLength: 256, nullable: false),
                    sent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.SMS", x => x.messageId);
                });

            migrationBuilder.CreateTable(
                name: "ad.CarModel",
                schema: "ad",
                columns: table => new
                {
                    modelId = table.Column<int>(nullable: false),
                    brandId = table.Column<int>(nullable: false),
                    modelName = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.CarModel", x => x.modelId);
                    table.ForeignKey(
                        name: "FK_ad.CarModel_ad.Brands_brandId",
                        column: x => x.brandId,
                        principalSchema: "ad",
                        principalTable: "ad.Brands",
                        principalColumn: "brandId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ad.Cities",
                schema: "ad",
                columns: table => new
                {
                    cityId = table.Column<int>(nullable: false),
                    cityName = table.Column<string>(maxLength: 150, nullable: false),
                    provinceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Cities", x => x.cityId);
                    table.ForeignKey(
                        name: "FK_ad.Cities_ad.Provinces_provinceId",
                        column: x => x.provinceId,
                        principalSchema: "ad",
                        principalTable: "ad.Provinces",
                        principalColumn: "provinceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ad.Districts",
                schema: "ad",
                columns: table => new
                {
                    districtId = table.Column<int>(nullable: false),
                    cityId = table.Column<int>(nullable: false),
                    districtName = table.Column<string>(maxLength: 150, nullable: false),
                    municipalId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Districts", x => x.districtId);
                    table.ForeignKey(
                        name: "FK_ad.Districts_ad.Cities_cityId",
                        column: x => x.cityId,
                        principalSchema: "ad",
                        principalTable: "ad.Cities",
                        principalColumn: "cityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ad.Advertisements",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    WhatIsSheDoing = table.Column<int>(nullable: false),
                    adComments = table.Column<string>(maxLength: 1000, nullable: false),
                    adInsertDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    adLink = table.Column<string>(maxLength: 500, nullable: false),
                    adNumberOfVisited = table.Column<int>(nullable: false),
                    adStatusId = table.Column<int>(nullable: false),
                    adTitle = table.Column<string>(maxLength: 250, nullable: false),
                    categoryId = table.Column<int>(nullable: false),
                    districtId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Advertisements", x => x.adId);
                    table.ForeignKey(
                        name: "FK_ad.Advertisements_ad.AdStatus_adStatusId",
                        column: x => x.adStatusId,
                        principalSchema: "ad",
                        principalTable: "ad.AdStatus",
                        principalColumn: "adStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ad.Advertisements_ad.Categories_categoryId",
                        column: x => x.categoryId,
                        principalSchema: "ad",
                        principalTable: "ad.Categories",
                        principalColumn: "categoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ad.Advertisements_ad.Districts_districtId",
                        column: x => x.districtId,
                        principalSchema: "ad",
                        principalTable: "ad.Districts",
                        principalColumn: "districtId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ad.AdAttributeTransportation",
                schema: "ad",
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
                    table.PrimaryKey("PK_ad.AdAttributeTransportation", x => x.attributeId);
                    table.ForeignKey(
                        name: "FK_ad.AdAttributeTransportation_ad.Advertisements_adId",
                        column: x => x.adId,
                        principalSchema: "ad",
                        principalTable: "ad.Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ad.AdAttributeTransportation_ad.CarModel_modelId",
                        column: x => x.modelId,
                        principalSchema: "ad",
                        principalTable: "ad.CarModel",
                        principalColumn: "modelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ad.AdPrivilege",
                schema: "ad",
                columns: table => new
                {
                    insertionDate = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    AdvertisementadId = table.Column<Guid>(nullable: true),
                    adId = table.Column<Guid>(nullable: false),
                    privilegeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.AdPrivilege", x => x.insertionDate);
                    table.UniqueConstraint("AK_ad.AdPrivilege_adId", x => x.adId);
                    table.UniqueConstraint("AK_ad.AdPrivilege_adId_insertionDate_privilegeId", x => new { x.adId, x.insertionDate, x.privilegeId });
                    table.ForeignKey(
                        name: "FK_ad.AdPrivilege_ad.Advertisements_AdvertisementadId",
                        column: x => x.AdvertisementadId,
                        principalSchema: "ad",
                        principalTable: "ad.Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ad.AdPrivilege_ad.Privilege_privilegeId",
                        column: x => x.privilegeId,
                        principalSchema: "ad",
                        principalTable: "ad.Privilege",
                        principalColumn: "privilegeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ad.Price",
                schema: "ad",
                columns: table => new
                {
                    adId = table.Column<Guid>(nullable: false),
                    AdvertisementadId = table.Column<Guid>(nullable: true),
                    price = table.Column<decimal>(type: "money", nullable: true),
                    priceType = table.Column<string>(maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.Price", x => x.adId);
                    table.ForeignKey(
                        name: "FK_ad.Price_ad.Advertisements_AdvertisementadId",
                        column: x => x.AdvertisementadId,
                        principalSchema: "ad",
                        principalTable: "ad.Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ad.SimilarAds",
                schema: "ad",
                columns: table => new
                {
                    similarAdId = table.Column<Guid>(nullable: false),
                    AdvertisementadId = table.Column<Guid>(nullable: true),
                    adId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ad.SimilarAds", x => x.similarAdId);
                    table.UniqueConstraint("AK_ad.SimilarAds_adId", x => x.adId);
                    table.UniqueConstraint("AK_ad.SimilarAds_adId_similarAdId", x => new { x.adId, x.similarAdId });
                    table.ForeignKey(
                        name: "FK_ad.SimilarAds_ad.Advertisements_AdvertisementadId",
                        column: x => x.AdvertisementadId,
                        principalSchema: "ad",
                        principalTable: "ad.Advertisements",
                        principalColumn: "adId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ad.AdAttributeTransportation_adId",
                schema: "ad",
                table: "ad.AdAttributeTransportation",
                column: "adId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.AdAttributeTransportation_modelId",
                schema: "ad",
                table: "ad.AdAttributeTransportation",
                column: "modelId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.AdPrivilege_AdvertisementadId",
                schema: "ad",
                table: "ad.AdPrivilege",
                column: "AdvertisementadId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.AdPrivilege_privilegeId",
                schema: "ad",
                table: "ad.AdPrivilege",
                column: "privilegeId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Advertisements_adStatusId",
                schema: "ad",
                table: "ad.Advertisements",
                column: "adStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Advertisements_categoryId",
                schema: "ad",
                table: "ad.Advertisements",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Advertisements_districtId",
                schema: "ad",
                table: "ad.Advertisements",
                column: "districtId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.CarModel_brandId",
                schema: "ad",
                table: "ad.CarModel",
                column: "brandId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Cities_provinceId",
                schema: "ad",
                table: "ad.Cities",
                column: "provinceId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Districts_cityId",
                schema: "ad",
                table: "ad.Districts",
                column: "cityId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.Price_AdvertisementadId",
                schema: "ad",
                table: "ad.Price",
                column: "AdvertisementadId");

            migrationBuilder.CreateIndex(
                name: "IX_ad.SimilarAds_AdvertisementadId",
                schema: "ad",
                table: "ad.SimilarAds",
                column: "AdvertisementadId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ad.AdAttributeTransportation",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.AdPrivilege",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.MobileBrands",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Price",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.SimilarAds",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.SMS",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.CarModel",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Privilege",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Advertisements",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Brands",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.AdStatus",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Categories",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Districts",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Cities",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "ad.Provinces",
                schema: "ad");
        }
    }
}
