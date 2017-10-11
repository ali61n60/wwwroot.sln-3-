using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using RepositoryStd.Context.AD;

namespace RepositoryStd.Migrations
{
    [DbContext(typeof(AdDbContext))]
    partial class AdDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasDefaultSchema("ad")
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ModelStd.Db.AdAttributeTransportation", b =>
                {
                    b.Property<Guid>("attributeId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("adId");

                    b.Property<string>("bodyColor")
                        .HasMaxLength(50);

                    b.Property<string>("bodyStatus")
                        .HasMaxLength(50);

                    b.Property<string>("fuel")
                        .HasMaxLength(50);

                    b.Property<string>("gearbox")
                        .HasMaxLength(50);

                    b.Property<string>("internalColor")
                        .HasMaxLength(50);

                    b.Property<int?>("makeYear");

                    b.Property<int?>("mileage");

                    b.Property<int?>("modelId");

                    b.HasKey("attributeId");

                    b.HasIndex("adId");

                    b.HasIndex("modelId");

                    b.ToTable("AdAttributeTransportation");
                });

            modelBuilder.Entity("ModelStd.Db.AdPrivilege", b =>
                {
                    b.Property<DateTime>("insertionDate")
                        .HasColumnType("smalldatetime");

                    b.Property<Guid?>("AdvertisementadId");

                    b.Property<Guid>("adId");

                    b.Property<int>("privilegeId");

                    b.HasKey("insertionDate");

                    b.HasAlternateKey("adId");


                    b.HasAlternateKey("adId", "insertionDate", "privilegeId");

                    b.HasIndex("AdvertisementadId");

                    b.HasIndex("privilegeId");

                    b.ToTable("AdPrivilege");
                });

            modelBuilder.Entity("ModelStd.Db.AdStatu", b =>
                {
                    b.Property<int>("adStatusId");

                    b.Property<string>("adStatus")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<string>("adStatusEnglish")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("adStatusId");

                    b.ToTable("AdStatus");
                });

            modelBuilder.Entity("ModelStd.Db.Advertisement", b =>
                {
                    b.Property<Guid>("adId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("UserId");

                    b.Property<int>("WhatIsSheDoing");

                    b.Property<string>("adComments")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.Property<DateTime>("adInsertDateTime")
                        .HasColumnType("smalldatetime");

                    b.Property<string>("adLink")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<int>("adNumberOfVisited");

                    b.Property<int>("adStatusId");

                    b.Property<string>("adTitle")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<int>("categoryId");

                    b.Property<int>("districtId");

                    b.HasKey("adId");

                    b.HasIndex("adStatusId");

                    b.HasIndex("categoryId");

                    b.HasIndex("districtId");

                    b.ToTable("Advertisements");
                });

            modelBuilder.Entity("ModelStd.Db.Brand", b =>
                {
                    b.Property<int>("brandId");

                    b.Property<string>("brandName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("brandId");

                    b.ToTable("Brands");
                });

            modelBuilder.Entity("ModelStd.Db.CarModel", b =>
                {
                    b.Property<int>("modelId");

                    b.Property<int>("brandId");

                    b.Property<string>("modelName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("modelId");

                    b.HasIndex("brandId");

                    b.ToTable("CarModel");
                });

            modelBuilder.Entity("ModelStd.Db.Category", b =>
                {
                    b.Property<int>("categoryId");

                    b.Property<string>("categoryName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<string>("categoryNameEnglish")
                        .HasMaxLength(150);

                    b.Property<string>("categoryParentId")
                        .HasMaxLength(10);

                    b.HasKey("categoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("ModelStd.Db.City", b =>
                {
                    b.Property<int>("cityId");

                    b.Property<string>("cityName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<int?>("provinceId");

                    b.HasKey("cityId");

                    b.HasIndex("provinceId");

                    b.ToTable("Cities");
                });

            modelBuilder.Entity("ModelStd.Db.District", b =>
                {
                    b.Property<int>("districtId");

                    b.Property<int>("cityId");

                    b.Property<string>("districtName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.Property<int?>("municipalId");

                    b.HasKey("districtId");

                    b.HasIndex("cityId");

                    b.ToTable("Districts");
                });

            modelBuilder.Entity("ModelStd.Db.MobileBrand", b =>
                {
                    b.Property<int>("brandId");

                    b.Property<int>("brandMakerId");

                    b.Property<string>("brandName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("brandId");

                    b.ToTable("MobileBrands");
                });

            modelBuilder.Entity("ModelStd.Db.Price", b =>
                {
                    b.Property<Guid>("adId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("AdvertisementadId");

                    b.Property<decimal?>("price1")
                        .HasColumnName("price")
                        .HasColumnType("money");

                    b.Property<string>("priceType")
                        .HasMaxLength(150);

                    b.HasKey("adId");

                    b.HasIndex("AdvertisementadId");

                    b.ToTable("Price");
                });

            modelBuilder.Entity("ModelStd.Db.Privilege", b =>
                {
                    b.Property<int>("privilegeId");

                    b.Property<string>("privilegeName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("privilegeId");

                    b.ToTable("Privilege");
                });

            modelBuilder.Entity("ModelStd.Db.Province", b =>
                {
                    b.Property<int>("provinceId");

                    b.Property<string>("provinceCenter")
                        .HasMaxLength(150);

                    b.Property<string>("provinceName")
                        .IsRequired()
                        .HasMaxLength(150);

                    b.HasKey("provinceId");

                    b.ToTable("Provinces");
                });

            modelBuilder.Entity("ModelStd.Db.SimilarAd", b =>
                {
                    b.Property<Guid>("similarAdId")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("AdvertisementadId");

                    b.Property<Guid>("adId");

                    b.HasKey("similarAdId");

                    b.HasAlternateKey("adId");


                    b.HasAlternateKey("adId", "similarAdId");

                    b.HasIndex("AdvertisementadId");

                    b.ToTable("SimilarAds");
                });

            modelBuilder.Entity("ModelStd.Db.SM", b =>
                {
                    b.Property<Guid>("messageId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("message")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<DateTime>("messageDate");

                    b.Property<string>("phoneNumber")
                        .IsRequired()
                        .HasMaxLength(256);

                    b.Property<bool>("sent");

                    b.HasKey("messageId");

                    b.ToTable("SMS");
                });

            modelBuilder.Entity("ModelStd.Db.AdAttributeTransportation", b =>
                {
                    b.HasOne("ModelStd.Db.Advertisement", "Advertisement")
                        .WithMany("AdAttributeTransportations")
                        .HasForeignKey("adId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.CarModel", "CarModel")
                        .WithMany("AdAttributeTransportations")
                        .HasForeignKey("modelId");
                });

            modelBuilder.Entity("ModelStd.Db.AdPrivilege", b =>
                {
                    b.HasOne("ModelStd.Db.Advertisement", "Advertisement")
                        .WithMany("AdPrivileges")
                        .HasForeignKey("AdvertisementadId");

                    b.HasOne("ModelStd.Db.Privilege", "Privilege")
                        .WithMany("AdPrivileges")
                        .HasForeignKey("privilegeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Advertisement", b =>
                {
                    b.HasOne("ModelStd.Db.AdStatu", "AdStatu")
                        .WithMany("Advertisements")
                        .HasForeignKey("adStatusId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.Category", "Category")
                        .WithMany("Advertisements")
                        .HasForeignKey("categoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.District", "District")
                        .WithMany("Advertisements")
                        .HasForeignKey("districtId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.CarModel", b =>
                {
                    b.HasOne("ModelStd.Db.Brand", "Brand")
                        .WithMany("CarModels")
                        .HasForeignKey("brandId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.City", b =>
                {
                    b.HasOne("ModelStd.Db.Province", "Province")
                        .WithMany("Cities")
                        .HasForeignKey("provinceId");
                });

            modelBuilder.Entity("ModelStd.Db.District", b =>
                {
                    b.HasOne("ModelStd.Db.City", "City")
                        .WithMany("Districts")
                        .HasForeignKey("cityId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Price", b =>
                {
                    b.HasOne("ModelStd.Db.Advertisement", "Advertisement")
                        .WithMany()
                        .HasForeignKey("AdvertisementadId");
                });

            modelBuilder.Entity("ModelStd.Db.SimilarAd", b =>
                {
                    b.HasOne("ModelStd.Db.Advertisement", "Advertisement")
                        .WithMany("SimilarAds")
                        .HasForeignKey("AdvertisementadId");
                });
        }
    }
}
