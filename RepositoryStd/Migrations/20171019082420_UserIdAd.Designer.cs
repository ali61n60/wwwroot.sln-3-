using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using RepositoryStd.Context.AD;

namespace RepositoryStd.Migrations
{
    [DbContext(typeof(AdDbContext))]
    [Migration("20171019082420_UserIdAd")]
    partial class UserIdAd
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ModelStd.Db.Ad.AdAttributeTransportation", b =>
                {
                    b.Property<Guid>("AttributeId")
                        .HasColumnName("attributeId");

                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<string>("BodyColor")
                        .HasColumnName("bodyColor")
                        .HasMaxLength(50);

                    b.Property<string>("BodyStatus")
                        .HasColumnName("bodyStatus")
                        .HasMaxLength(50);

                    b.Property<string>("Fuel")
                        .HasColumnName("fuel")
                        .HasMaxLength(50);

                    b.Property<string>("Gearbox")
                        .HasColumnName("gearbox")
                        .HasMaxLength(50);

                    b.Property<string>("InternalColor")
                        .HasColumnName("internalColor")
                        .HasMaxLength(50);

                    b.Property<int?>("MakeYear")
                        .HasColumnName("makeYear");

                    b.Property<int?>("Mileage")
                        .HasColumnName("mileage");

                    b.Property<int?>("ModelId")
                        .HasColumnName("modelId");

                    b.HasKey("AttributeId")
                        .HasName("PK_AdAttributeCar");

                    b.HasIndex("AdId");

                    b.HasIndex("ModelId");

                    b.ToTable("AdAttributeTransportation","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdPrivilege", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<int>("PrivilegeId")
                        .HasColumnName("privilegeId");

                    b.Property<DateTime>("InsertionDate")
                        .HasColumnName("insertionDate")
                        .HasColumnType("smalldatetime");

                    b.HasKey("AdId", "PrivilegeId", "InsertionDate")
                        .HasName("PK_AdPrivilage");

                    b.HasIndex("PrivilegeId");

                    b.ToTable("AdPrivilege","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdStatus", b =>
                {
                    b.Property<int>("AdStatusId")
                        .HasColumnName("adStatusId");

                    b.Property<string>("AdStatus1")
                        .IsRequired()
                        .HasColumnName("adStatus")
                        .HasMaxLength(150);

                    b.Property<string>("AdStatusEnglish")
                        .IsRequired()
                        .HasColumnName("adStatusEnglish")
                        .HasMaxLength(150);

                    b.HasKey("AdStatusId");

                    b.ToTable("AdStatus","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Advertisements", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<string>("AdComments")
                        .IsRequired()
                        .HasColumnName("adComments")
                        .HasMaxLength(1000);

                    b.Property<DateTime>("AdInsertDateTime")
                        .HasColumnName("adInsertDateTime")
                        .HasColumnType("smalldatetime");

                    b.Property<string>("AdLink")
                        .IsRequired()
                        .HasColumnName("adLink")
                        .HasMaxLength(500);

                    b.Property<int>("AdNumberOfVisited")
                        .HasColumnName("adNumberOfVisited");

                    b.Property<int>("AdStatusId")
                        .HasColumnName("adStatusId");

                    b.Property<string>("AdTitle")
                        .IsRequired()
                        .HasColumnName("adTitle")
                        .HasMaxLength(250);

                    b.Property<int>("CategoryId")
                        .HasColumnName("categoryId");

                    b.Property<int>("DistrictId")
                        .HasColumnName("districtId");

                    b.Property<string>("UserId");

                    b.Property<int>("WhatIsSheDoing")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("0");

                    b.HasKey("AdId")
                        .HasName("PK_Advertisements_1");

                    b.HasIndex("AdStatusId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("DistrictId");

                    b.ToTable("Advertisements","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Brands", b =>
                {
                    b.Property<int>("BrandId")
                        .HasColumnName("brandId");

                    b.Property<string>("BrandName")
                        .IsRequired()
                        .HasColumnName("brandName")
                        .HasMaxLength(150);

                    b.HasKey("BrandId")
                        .HasName("PK_CarMakers");

                    b.ToTable("Brands","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.CarModel", b =>
                {
                    b.Property<int>("ModelId")
                        .HasColumnName("modelId");

                    b.Property<int>("BrandId")
                        .HasColumnName("brandId");

                    b.Property<string>("ModelName")
                        .IsRequired()
                        .HasColumnName("modelName")
                        .HasMaxLength(150);

                    b.HasKey("ModelId")
                        .HasName("PK_CarBrand");

                    b.HasIndex("BrandId");

                    b.ToTable("CarModel","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Categories", b =>
                {
                    b.Property<int>("CategoryId")
                        .HasColumnName("categoryId");

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasColumnName("categoryName")
                        .HasMaxLength(150);

                    b.Property<string>("CategoryNameEnglish")
                        .HasColumnName("categoryNameEnglish")
                        .HasMaxLength(150);

                    b.Property<string>("CategoryParentId")
                        .HasColumnName("categoryParentId")
                        .HasColumnType("nchar(10)");

                    b.HasKey("CategoryId")
                        .HasName("PK_Categories");

                    b.ToTable("Categories","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Cities", b =>
                {
                    b.Property<int>("CityId")
                        .HasColumnName("cityId");

                    b.Property<string>("CityName")
                        .IsRequired()
                        .HasColumnName("cityName")
                        .HasMaxLength(150);

                    b.Property<int?>("ProvinceId")
                        .HasColumnName("provinceId");

                    b.HasKey("CityId")
                        .HasName("PK_Cities");

                    b.HasIndex("ProvinceId");

                    b.ToTable("Cities","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Districts", b =>
                {
                    b.Property<int>("DistrictId")
                        .HasColumnName("districtId");

                    b.Property<int>("CityId")
                        .HasColumnName("cityId");

                    b.Property<string>("DistrictName")
                        .IsRequired()
                        .HasColumnName("districtName")
                        .HasMaxLength(150);

                    b.Property<int?>("MunicipalId")
                        .HasColumnName("municipalId");

                    b.HasKey("DistrictId")
                        .HasName("PK_Districts");

                    b.HasIndex("CityId");

                    b.ToTable("Districts","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.MobileBrands", b =>
                {
                    b.Property<int>("BrandId")
                        .HasColumnName("brandId");

                    b.Property<int>("BrandMakerId")
                        .HasColumnName("brandMakerId");

                    b.Property<string>("BrandName")
                        .IsRequired()
                        .HasColumnName("brandName")
                        .HasMaxLength(150);

                    b.HasKey("BrandId")
                        .HasName("PK_MobileBrands");

                    b.ToTable("MobileBrands","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Price", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<decimal?>("price")
                        .HasColumnName("price")
                        .HasColumnType("money");

                    b.Property<string>("priceType")
                        .HasColumnName("priceType")
                        .HasMaxLength(150);

                    b.HasKey("AdId")
                        .HasName("PK_Price");

                    b.ToTable("Price","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Privilege", b =>
                {
                    b.Property<int>("PrivilegeId")
                        .HasColumnName("privilegeId");

                    b.Property<string>("PrivilegeName")
                        .IsRequired()
                        .HasColumnName("privilegeName")
                        .HasMaxLength(150);

                    b.HasKey("PrivilegeId");

                    b.ToTable("Privilege","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Provinces", b =>
                {
                    b.Property<int>("ProvinceId")
                        .HasColumnName("provinceId");

                    b.Property<string>("ProvinceCenter")
                        .HasColumnName("provinceCenter")
                        .HasMaxLength(150);

                    b.Property<string>("ProvinceName")
                        .IsRequired()
                        .HasColumnName("provinceName")
                        .HasMaxLength(150);

                    b.HasKey("ProvinceId")
                        .HasName("PK_Provinces");

                    b.ToTable("Provinces","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.SimilarAds", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<Guid>("SimilarAdId")
                        .HasColumnName("similarAdId");

                    b.HasKey("AdId", "SimilarAdId")
                        .HasName("PK_SimilarAds");

                    b.ToTable("SimilarAds","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Sms", b =>
                {
                    b.Property<Guid>("MessageId")
                        .HasColumnName("messageId");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnName("message")
                        .HasMaxLength(256);

                    b.Property<DateTime>("MessageDate")
                        .HasColumnName("messageDate")
                        .HasColumnType("datetime");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnName("phoneNumber")
                        .HasMaxLength(256);

                    b.Property<bool>("Sent")
                        .HasColumnName("sent");

                    b.HasKey("MessageId")
                        .HasName("PK_SMS");

                    b.ToTable("SMS","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdAttributeTransportation", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("AdAttributeTransportation")
                        .HasForeignKey("AdId");

                    b.HasOne("ModelStd.Db.Ad.CarModel", "Model")
                        .WithMany("AdAttributeTransportation")
                        .HasForeignKey("ModelId");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdPrivilege", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("AdId");

                    b.HasOne("ModelStd.Db.Ad.Privilege", "Privilege")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("PrivilegeId")
                        .HasConstraintName("FK_AdPrivilege_Privilege");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Advertisements", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.AdStatus", "AdStatus")
                        .WithMany("Advertisements")
                        .HasForeignKey("AdStatusId")
                        .HasConstraintName("FK_Advertisements_AdTypes");

                    b.HasOne("ModelStd.Db.Ad.Categories", "Category")
                        .WithMany("Advertisements")
                        .HasForeignKey("CategoryId");

                    b.HasOne("ModelStd.Db.Ad.Districts", "District")
                        .WithMany("Advertisements")
                        .HasForeignKey("DistrictId");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.CarModel", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Brands", "Brand")
                        .WithMany("CarModel")
                        .HasForeignKey("BrandId")
                        .HasConstraintName("FK_CarBrands_Makers");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Cities", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Provinces", "Province")
                        .WithMany("Cities")
                        .HasForeignKey("ProvinceId");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Districts", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Cities", "City")
                        .WithMany("Districts")
                        .HasForeignKey("CityId")
                        .HasConstraintName("FK_Districts_Cities");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Price", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithOne("Price")
                        .HasForeignKey("ModelStd.Db.Ad.Price", "AdId")
                        .HasConstraintName("FK_Price_Advertisements");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.SimilarAds", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("SimilarAds")
                        .HasForeignKey("AdId")
                        .HasConstraintName("FK_SimilarAds_Advertisements");
                });
        }
    }
}
