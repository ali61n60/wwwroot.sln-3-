using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using RepositoryStd.Context.AD;

namespace RepositoryStd.Migrations
{
    [DbContext(typeof(AdDbContext))]
    [Migration("20180117172823_markingAds2")]
    partial class markingAds2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasDefaultSchema("ad")
                .HasAnnotation("ProductVersion", "1.1.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ModelStd.Db.Ad.AdAttributeTransportation", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<string>("BodyColor")
                        .HasColumnName("bodyColor")
                        .HasMaxLength(50);

                    b.Property<string>("BodyStatus")
                        .HasColumnName("bodyStatus")
                        .HasMaxLength(50);

                    b.Property<string>("CarStatus")
                        .HasColumnName("carStatus")
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

                    b.Property<string>("PlateType")
                        .HasColumnName("plateType")
                        .HasMaxLength(50);

                    b.HasKey("AdId");

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

                    b.HasAlternateKey("AdId");

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

                    b.Property<string>("UserId")
                        .HasColumnName("UserId")
                        .HasMaxLength(200);

                    b.HasKey("AdId")
                        .HasName("PK_Advertisements_1");

                    b.HasIndex("AdStatusId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("DistrictId");

                    b.ToTable("Advertisements","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Brand", b =>
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

            modelBuilder.Entity("ModelStd.Db.Ad.City", b =>
                {
                    b.Property<int>("CityId")
                        .HasColumnName("cityId");

                    b.Property<string>("CityName")
                        .IsRequired()
                        .HasColumnName("cityName")
                        .HasMaxLength(150);

                    b.Property<int?>("ProvinceId")
                        .IsRequired()
                        .HasColumnName("provinceId");

                    b.HasKey("CityId");

                    b.HasIndex("ProvinceId");

                    b.ToTable("Cities","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.District", b =>
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

                    b.HasKey("DistrictId");

                    b.HasIndex("CityId");

                    b.ToTable("Districts","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.MarkedAd", b =>
                {
                    b.Property<Guid>("AdId")
                        .HasColumnName("adId");

                    b.Property<string>("UserId")
                        .HasColumnName("userId");

                    b.HasKey("AdId", "UserId")
                        .HasName("PK_MarkedAd");

                    b.HasIndex("UserId");

                    b.ToTable("MarkedA","ad");
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

                    b.HasKey("AdId");

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

            modelBuilder.Entity("ModelStd.Db.Ad.Province", b =>
                {
                    b.Property<int>("ProvinceId")
                        .HasColumnName("provinceId");

                    b.Property<string>("ProvinceCenter")
                        .IsRequired()
                        .HasColumnName("provinceCenter")
                        .HasMaxLength(150);

                    b.Property<string>("ProvinceName")
                        .IsRequired()
                        .HasColumnName("provinceName")
                        .HasMaxLength(150);

                    b.HasKey("ProvinceId");

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

                    b.HasAlternateKey("AdId");

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

            modelBuilder.Entity("ModelStd.Db.Ad.Temperature", b =>
                {
                    b.Property<int>("TemperatureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("temperatureId");

                    b.Property<DateTime>("InsertDateTime")
                        .HasColumnName("insertDateTime")
                        .HasColumnType("smalldatetime");

                    b.Property<int>("Temp")
                        .HasColumnName("temp");

                    b.HasKey("TemperatureId");

                    b.ToTable("Temperatures","ad");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetRoleClaims", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetRoles", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("Name");

                    b.Property<string>("NormalizedName");

                    b.HasKey("Id");

                    b.ToTable("AspNetRoles","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserClaims", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserLogins", b =>
                {
                    b.Property<string>("LoginProvider")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("UserId");

                    b.HasKey("LoginProvider");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserRoles", b =>
                {
                    b.Property<string>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("RoleId");

                    b.Property<string>("UserId1");

                    b.HasKey("UserId");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId1");

                    b.ToTable("AspNetUserRoles","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUsers", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp");

                    b.Property<string>("Email");

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail");

                    b.Property<string>("NormalizedUserName");

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.ToTable("AspNetUsers","identity");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdAttributeTransportation", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.CarModel", "Model")
                        .WithMany("AdAttributeTransportation")
                        .HasForeignKey("ModelId")
                        .HasConstraintName("FK_AdAttributeTransportation_CarBrands");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.AdPrivilege", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("AdId")
                        .HasConstraintName("FK_AdPrivilage_Advertisements")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.Ad.Privilege", "Privilege")
                        .WithMany("AdPrivilege")
                        .HasForeignKey("PrivilegeId")
                        .HasConstraintName("FK_AdPrivilege_Privilege");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Advertisements", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.AdAttributeTransportation", "AdAttributeTransportation")
                        .WithOne("Ad")
                        .HasForeignKey("ModelStd.Db.Ad.Advertisements", "AdId")
                        .HasConstraintName("FK_AdAttributeTransportation_Advertisements")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.Ad.AdStatus", "AdStatus")
                        .WithMany("Advertisements")
                        .HasForeignKey("AdStatusId")
                        .HasConstraintName("FK_Advertisements_AdTypes");

                    b.HasOne("ModelStd.Db.Ad.Categories", "Category")
                        .WithMany("Advertisements")
                        .HasForeignKey("CategoryId")
                        .HasConstraintName("FK_Advertisements_Categories");

                    b.HasOne("ModelStd.Db.Ad.District", "District")
                        .WithMany("Advertisements")
                        .HasForeignKey("DistrictId")
                        .HasConstraintName("FK_Advertisements_Districts");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.CarModel", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Brand", "Brand")
                        .WithMany("CarModel")
                        .HasForeignKey("BrandId")
                        .HasConstraintName("FK_CarBrands_Makers");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.City", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Province", "Province")
                        .WithMany("Cities")
                        .HasForeignKey("ProvinceId")
                        .HasConstraintName("FK_Cities_Provinces")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Ad.District", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.City", "City")
                        .WithMany("Districts")
                        .HasForeignKey("CityId")
                        .HasConstraintName("FK_Districts_Cities");
                });

            modelBuilder.Entity("ModelStd.Db.Ad.MarkedAd", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("MarkedAds")
                        .HasForeignKey("AdId")
                        .HasConstraintName("FK_MarkedAds_Advertisements")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelStd.Db.Identity.AspNetUsers", "User")
                        .WithMany("MarkedAds")
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_MarkedAds_AspNetUsers")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Ad.Price", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithOne("Price")
                        .HasForeignKey("ModelStd.Db.Ad.Price", "AdId")
                        .HasConstraintName("FK_Price_Advertisements")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Ad.SimilarAds", b =>
                {
                    b.HasOne("ModelStd.Db.Ad.Advertisements", "Ad")
                        .WithMany("SimilarAds")
                        .HasForeignKey("AdId")
                        .HasConstraintName("FK_SimilarAds_Advertisements")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetRoleClaims", b =>
                {
                    b.HasOne("ModelStd.Db.Identity.AspNetRoles", "Role")
                        .WithMany("AspNetRoleClaims")
                        .HasForeignKey("RoleId");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserClaims", b =>
                {
                    b.HasOne("ModelStd.Db.Identity.AspNetUsers", "User")
                        .WithMany("AspNetUserClaims")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserLogins", b =>
                {
                    b.HasOne("ModelStd.Db.Identity.AspNetUsers", "User")
                        .WithMany("AspNetUserLogins")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("ModelStd.Db.Identity.AspNetUserRoles", b =>
                {
                    b.HasOne("ModelStd.Db.Identity.AspNetRoles", "Role")
                        .WithMany("AspNetUserRoles")
                        .HasForeignKey("RoleId");

                    b.HasOne("ModelStd.Db.Identity.AspNetUsers", "User")
                        .WithMany("AspNetUserRoles")
                        .HasForeignKey("UserId1");
                });
        }
    }
}
