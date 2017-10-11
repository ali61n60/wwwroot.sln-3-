using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RepositoryStd.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.EnsureSchema(
            //    name: "ad");

            //migrationBuilder.CreateTable(
            //    name: "AdStatus",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        adStatusId = table.Column<int>(nullable: false),
            //        adStatus = table.Column<string>(maxLength: 150, nullable: false),
            //        adStatusEnglish = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AdStatus", x => x.adStatusId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Brands",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        brandId = table.Column<int>(nullable: false),
            //        brandName = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_CarMakers", x => x.brandId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Categories",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        categoryId = table.Column<int>(nullable: false),
            //        categoryName = table.Column<string>(maxLength: 150, nullable: false),
            //        categoryNameEnglish = table.Column<string>(maxLength: 150, nullable: true),
            //        categoryParentId = table.Column<string>(type: "nchar(10)", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Categories", x => x.categoryId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "MobileBrands",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        brandId = table.Column<int>(nullable: false),
            //        brandMakerId = table.Column<int>(nullable: false),
            //        brandName = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_MobileBrands", x => x.brandId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Privilege",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        privilegeId = table.Column<int>(nullable: false),
            //        privilegeName = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Privilege", x => x.privilegeId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Provinces",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        provinceId = table.Column<int>(nullable: false),
            //        provinceCenter = table.Column<string>(maxLength: 150, nullable: true),
            //        provinceName = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Provinces", x => x.provinceId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "SMS",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        messageId = table.Column<Guid>(nullable: false),
            //        message = table.Column<string>(maxLength: 256, nullable: false),
            //        messageDate = table.Column<DateTime>(type: "datetime", nullable: false),
            //        phoneNumber = table.Column<string>(maxLength: 256, nullable: false),
            //        sent = table.Column<bool>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_SMS", x => x.messageId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "CarModel",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        modelId = table.Column<int>(nullable: false),
            //        brandId = table.Column<int>(nullable: false),
            //        modelName = table.Column<string>(maxLength: 150, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_CarBrand", x => x.modelId);
            //        table.ForeignKey(
            //            name: "FK_CarBrands_Makers",
            //            column: x => x.brandId,
            //            principalSchema: "ad",
            //            principalTable: "Brands",
            //            principalColumn: "brandId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Cities",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        cityId = table.Column<int>(nullable: false),
            //        cityName = table.Column<string>(maxLength: 150, nullable: false),
            //        provinceId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Cities", x => x.cityId);
            //        table.ForeignKey(
            //            name: "FK_Cities_Provinces_provinceId",
            //            column: x => x.provinceId,
            //            principalSchema: "ad",
            //            principalTable: "Provinces",
            //            principalColumn: "provinceId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Districts",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        districtId = table.Column<int>(nullable: false),
            //        cityId = table.Column<int>(nullable: false),
            //        districtName = table.Column<string>(maxLength: 150, nullable: false),
            //        municipalId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Districts", x => x.districtId);
            //        table.ForeignKey(
            //            name: "FK_Districts_Cities",
            //            column: x => x.cityId,
            //            principalSchema: "ad",
            //            principalTable: "Cities",
            //            principalColumn: "cityId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Advertisements",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        adId = table.Column<Guid>(nullable: false),
            //        adComments = table.Column<string>(maxLength: 1000, nullable: false),
            //        adInsertDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
            //        adLink = table.Column<string>(maxLength: 500, nullable: false),
            //        adNumberOfVisited = table.Column<int>(nullable: false),
            //        adStatusId = table.Column<int>(nullable: false),
            //        adTitle = table.Column<string>(maxLength: 250, nullable: false),
            //        categoryId = table.Column<int>(nullable: false),
            //        districtId = table.Column<int>(nullable: false),
            //        UserId = table.Column<Guid>(nullable: false),
            //        WhatIsSheDoing = table.Column<int>(nullable: false, defaultValueSql: "0")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Advertisements_1", x => x.adId);
            //        table.ForeignKey(
            //            name: "FK_Advertisements_AdTypes",
            //            column: x => x.adStatusId,
            //            principalSchema: "ad",
            //            principalTable: "AdStatus",
            //            principalColumn: "adStatusId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Advertisements_Categories_categoryId",
            //            column: x => x.categoryId,
            //            principalSchema: "ad",
            //            principalTable: "Categories",
            //            principalColumn: "categoryId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Advertisements_Districts_districtId",
            //            column: x => x.districtId,
            //            principalSchema: "ad",
            //            principalTable: "Districts",
            //            principalColumn: "districtId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "AdAttributeTransportation",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        attributeId = table.Column<Guid>(nullable: false),
            //        adId = table.Column<Guid>(nullable: false),
            //        bodyColor = table.Column<string>(maxLength: 50, nullable: true),
            //        bodyStatus = table.Column<string>(maxLength: 50, nullable: true),
            //        fuel = table.Column<string>(maxLength: 50, nullable: true),
            //        gearbox = table.Column<string>(maxLength: 50, nullable: true),
            //        internalColor = table.Column<string>(maxLength: 50, nullable: true),
            //        makeYear = table.Column<int>(nullable: true),
            //        mileage = table.Column<int>(nullable: true),
            //        modelId = table.Column<int>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AdAttributeCar", x => x.attributeId);
            //        table.ForeignKey(
            //            name: "FK_AdAttributeTransportation_Advertisements_adId",
            //            column: x => x.adId,
            //            principalSchema: "ad",
            //            principalTable: "Advertisements",
            //            principalColumn: "adId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_AdAttributeTransportation_CarModel_modelId",
            //            column: x => x.modelId,
            //            principalSchema: "ad",
            //            principalTable: "CarModel",
            //            principalColumn: "modelId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "AdPrivilege",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        adId = table.Column<Guid>(nullable: false),
            //        privilegeId = table.Column<int>(nullable: false),
            //        insertionDate = table.Column<DateTime>(type: "smalldatetime", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AdPrivilage", x => new { x.adId, x.privilegeId, x.insertionDate });
            //        table.ForeignKey(
            //            name: "FK_AdPrivilege_Advertisements_adId",
            //            column: x => x.adId,
            //            principalSchema: "ad",
            //            principalTable: "Advertisements",
            //            principalColumn: "adId",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_AdPrivilege_Privilege",
            //            column: x => x.privilegeId,
            //            principalSchema: "ad",
            //            principalTable: "Privilege",
            //            principalColumn: "privilegeId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Price",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        adId = table.Column<Guid>(nullable: false),
            //        price = table.Column<decimal>(type: "money", nullable: true),
            //        priceType = table.Column<string>(maxLength: 150, nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Price", x => x.adId);
            //        table.ForeignKey(
            //            name: "FK_Price_Advertisements",
            //            column: x => x.adId,
            //            principalSchema: "ad",
            //            principalTable: "Advertisements",
            //            principalColumn: "adId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "SimilarAds",
            //    schema: "ad",
            //    columns: table => new
            //    {
            //        adId = table.Column<Guid>(nullable: false),
            //        similarAdId = table.Column<Guid>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_SimilarAds", x => new { x.adId, x.similarAdId });
            //        table.ForeignKey(
            //            name: "FK_SimilarAds_Advertisements",
            //            column: x => x.adId,
            //            principalSchema: "ad",
            //            principalTable: "Advertisements",
            //            principalColumn: "adId",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateIndex(
            //    name: "IX_AdAttributeTransportation_adId",
            //    schema: "ad",
            //    table: "AdAttributeTransportation",
            //    column: "adId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_AdAttributeTransportation_modelId",
            //    schema: "ad",
            //    table: "AdAttributeTransportation",
            //    column: "modelId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_AdPrivilege_privilegeId",
            //    schema: "ad",
            //    table: "AdPrivilege",
            //    column: "privilegeId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Advertisements_adStatusId",
            //    schema: "ad",
            //    table: "Advertisements",
            //    column: "adStatusId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Advertisements_categoryId",
            //    schema: "ad",
            //    table: "Advertisements",
            //    column: "categoryId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Advertisements_districtId",
            //    schema: "ad",
            //    table: "Advertisements",
            //    column: "districtId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_CarModel_brandId",
            //    schema: "ad",
            //    table: "CarModel",
            //    column: "brandId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Cities_provinceId",
            //    schema: "ad",
            //    table: "Cities",
            //    column: "provinceId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Districts_cityId",
            //    schema: "ad",
            //    table: "Districts",
            //    column: "cityId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdAttributeTransportation",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "AdPrivilege",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "MobileBrands",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Price",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "SimilarAds",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "SMS",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "CarModel",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Privilege",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Advertisements",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Brands",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "AdStatus",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Categories",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Districts",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Cities",
                schema: "ad");

            migrationBuilder.DropTable(
                name: "Provinces",
                schema: "ad");
        }
    }
}
