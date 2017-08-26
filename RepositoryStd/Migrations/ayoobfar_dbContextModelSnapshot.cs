using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using RepositoryStd.DbModel;

namespace RepositoryStd.Migrations
{
    [DbContext(typeof(ayoobfar_dbContext))]
    partial class ayoobfar_dbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("RepositoryStd.DbModel.AdAttributeTransportation", b =>
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

                    b.ToTable("AdAttributeTransportation");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AdPrivilege", b =>
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

                    b.ToTable("AdPrivilege");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AdStatus", b =>
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

                    b.ToTable("AdStatus");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Advertisements", b =>
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

                    b.Property<Guid>("UserId");

                    b.Property<int>("WhatIsSheDoing");

                    b.HasKey("AdId")
                        .HasName("PK_Advertisements_1");

                    b.HasIndex("AdStatusId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("DistrictId");

                    b.ToTable("Advertisements");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetRoleClaims", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasMaxLength(450);

                    b.HasKey("Id");

                    b.HasIndex("RoleId")
                        .HasName("IX_AspNetRoleClaims_RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetRoles", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(450);

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserClaims", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(450);

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .HasName("IX_AspNetUserClaims_UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserLogins", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(450);

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(450);

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(450);

                    b.HasKey("LoginProvider", "ProviderKey")
                        .HasName("PK_AspNetUserLogins");

                    b.HasIndex("UserId")
                        .HasName("IX_AspNetUserLogins_UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserRoles", b =>
                {
                    b.Property<string>("UserId")
                        .HasMaxLength(450);

                    b.Property<string>("RoleId")
                        .HasMaxLength(450);

                    b.HasKey("UserId", "RoleId")
                        .HasName("PK_AspNetUserRoles");

                    b.HasIndex("RoleId")
                        .HasName("IX_AspNetUserRoles_RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUsers", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(450);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserTokens", b =>
                {
                    b.Property<string>("UserId")
                        .HasMaxLength(450);

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(450);

                    b.Property<string>("Name")
                        .HasMaxLength(450);

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name")
                        .HasName("PK_AspNetUserTokens");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Brands", b =>
                {
                    b.Property<int>("BrandId")
                        .HasColumnName("brandId");

                    b.Property<string>("BrandName")
                        .IsRequired()
                        .HasColumnName("brandName")
                        .HasMaxLength(150);

                    b.HasKey("BrandId")
                        .HasName("PK_CarMakers");

                    b.ToTable("Brands");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.CarModel", b =>
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

                    b.ToTable("CarModel");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Categories", b =>
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

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Cities", b =>
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

                    b.ToTable("Cities");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Districts", b =>
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

                    b.ToTable("Districts");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.MobileBrands", b =>
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

                    b.ToTable("MobileBrands");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Price", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<decimal?>("Price1")
                        .HasColumnName("price")
                        .HasColumnType("money");

                    b.Property<string>("PriceType")
                        .HasColumnName("priceType")
                        .HasMaxLength(150);

                    b.HasKey("AdId")
                        .HasName("PK_Price");

                    b.ToTable("Price");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Privilege", b =>
                {
                    b.Property<int>("PrivilegeId")
                        .HasColumnName("privilegeId");

                    b.Property<string>("PrivilegeName")
                        .IsRequired()
                        .HasColumnName("privilegeName")
                        .HasMaxLength(150);

                    b.HasKey("PrivilegeId");

                    b.ToTable("Privilege");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Provinces", b =>
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

                    b.ToTable("Provinces");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.SimilarAds", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<Guid>("SimilarAdId")
                        .HasColumnName("similarAdId");

                    b.HasKey("AdId", "SimilarAdId")
                        .HasName("PK_SimilarAds");

                    b.ToTable("SimilarAds");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Sms", b =>
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

                    b.ToTable("SMS");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Test", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.ToTable("Test");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Test2", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnName("id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasColumnType("nchar(10)");

                    b.HasKey("Id");

                    b.ToTable("test2");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Test3", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.ToTable("Test3");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Test4", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.ToTable("Test4");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.UsersExtraInfo", b =>
                {
                    b.Property<Guid>("UserId");

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasColumnName("emailAddress")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailAddressVerified")
                        .HasColumnName("emailAddressVerified");

                    b.Property<string>("EmailAddressVerifyCode")
                        .HasColumnName("emailAddressVerifyCode")
                        .HasMaxLength(50);

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnName("phoneNumber")
                        .HasMaxLength(16);

                    b.Property<bool>("PhoneNumberVerified")
                        .HasColumnName("phoneNumberVerified");

                    b.Property<string>("PhoneNumberVerifyCode")
                        .HasColumnName("phoneNumberVerifyCode")
                        .HasMaxLength(50);

                    b.HasKey("UserId")
                        .HasName("UQ__UsersExt__1788CC4DE633CBD7");

                    b.ToTable("UsersExtraInfo");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AdAttributeTransportation", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Advertisements", "Ad")
                        .WithMany("AdAttributeTransportation")
                        .HasForeignKey("AdId");

                    b.HasOne("RepositoryStd.DbModel.CarModel", "Model")
                        .WithMany("AdAttributeTransportation")
                        .HasForeignKey("ModelId");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AdPrivilege", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Advertisements", "Ad")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("AdId");

                    b.HasOne("RepositoryStd.DbModel.Privilege", "Privilege")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("PrivilegeId")
                        .HasConstraintName("FK_AdPrivilege_Privilege");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Advertisements", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.AdStatus", "AdStatus")
                        .WithMany("Advertisements")
                        .HasForeignKey("AdStatusId")
                        .HasConstraintName("FK_Advertisements_AdTypes");

                    b.HasOne("RepositoryStd.DbModel.Categories", "Category")
                        .WithMany("Advertisements")
                        .HasForeignKey("CategoryId");

                    b.HasOne("RepositoryStd.DbModel.Districts", "District")
                        .WithMany("Advertisements")
                        .HasForeignKey("DistrictId");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetRoleClaims", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.AspNetRoles", "Role")
                        .WithMany("AspNetRoleClaims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserClaims", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.AspNetUsers", "User")
                        .WithMany("AspNetUserClaims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserLogins", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.AspNetUsers", "User")
                        .WithMany("AspNetUserLogins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("RepositoryStd.DbModel.AspNetUserRoles", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.AspNetRoles", "Role")
                        .WithMany("AspNetUserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("RepositoryStd.DbModel.AspNetUsers", "User")
                        .WithMany("AspNetUserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("RepositoryStd.DbModel.CarModel", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Brands", "Brand")
                        .WithMany("CarModel")
                        .HasForeignKey("BrandId")
                        .HasConstraintName("FK_CarBrands_Makers");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Cities", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Provinces", "Province")
                        .WithMany("Cities")
                        .HasForeignKey("ProvinceId");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Districts", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Cities", "City")
                        .WithMany("Districts")
                        .HasForeignKey("CityId")
                        .HasConstraintName("FK_Districts_Cities");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.Price", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Advertisements", "Ad")
                        .WithOne("Price")
                        .HasForeignKey("RepositoryStd.DbModel.Price", "AdId")
                        .HasConstraintName("FK_Price_Advertisements");
                });

            modelBuilder.Entity("RepositoryStd.DbModel.SimilarAds", b =>
                {
                    b.HasOne("RepositoryStd.DbModel.Advertisements", "Ad")
                        .WithMany("SimilarAds")
                        .HasForeignKey("AdId")
                        .HasConstraintName("FK_SimilarAds_Advertisements");
                });
        }
    }
}
