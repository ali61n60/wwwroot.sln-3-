using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ModelStd.Db;

namespace RepositoryStd.DbModel
{
    //Scaffold-DbContext "Server= .\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true" Microsoft.EntityFrameworkCore.SqlServer -OutputDir DbModel

    public partial class ayoobfar_dbContext : DbContext
    {
        private string _queryString;

        public ayoobfar_dbContext(string queryString)
        {
            _queryString = queryString;
        }

        //public virtual DbSet<AdAttributeTransportation> AdAttributeTransportation { get; set; }
        //public virtual DbSet<AdPrivilege> AdPrivilege { get; set; }
        //public virtual DbSet<AdStatus> AdStatus { get; set; }
        //public virtual DbSet<Advertisements> Advertisements { get; set; }
        //public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        //public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        //public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        //public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        //public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        //public virtual DbSet<AspNetUserTokens> AspNetUserTokens { get; set; }
        //public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        //public virtual DbSet<Brands> Brands { get; set; }
        //public virtual DbSet<CarModel> CarModel { get; set; }
        //public virtual DbSet<Categories> Categories { get; set; }
        //public virtual DbSet<Cities> Cities { get; set; }
        //public virtual DbSet<Districts> Districts { get; set; }
        //public virtual DbSet<MobileBrands> MobileBrands { get; set; }
        //public virtual DbSet<Price> Price { get; set; }
        //public virtual DbSet<Privilege> Privilege { get; set; }
        //public virtual DbSet<Provinces> Provinces { get; set; }
        //public virtual DbSet<SimilarAds> SimilarAds { get; set; }
        //public virtual DbSet<Sms> Sms { get; set; }
        
        //public virtual DbSet<UsersExtraInfo> UsersExtraInfo { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    //@"Data Source= www.whereismycar.ir\MSSQLSERVER2012;Initial Catalog=whereism_database;Persist Security Info=True;User ID=whereism_ali;Password=Lam8u38@;MultipleActiveResultSets=true"
        //    optionsBuilder.UseSqlServer(_queryString);
        //}
       
           

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.HasDefaultSchema("ad");

            
        //    modelBuilder.Entity<AdAttributeTransportation>(entity =>
        //    {
        //        entity.HasKey(e => e.AttributeId)
        //            .HasName("PK_AdAttributeCar");

        //        entity.Property(e => e.AttributeId)
        //            .HasColumnName("attributeId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.AdId).HasColumnName("adId");

        //        entity.Property(e => e.BodyColor)
        //            .HasColumnName("bodyColor")
        //            .HasMaxLength(50);

        //        entity.Property(e => e.BodyStatus)
        //            .HasColumnName("bodyStatus")
        //            .HasMaxLength(50);

        //        entity.Property(e => e.Fuel)
        //            .HasColumnName("fuel")
        //            .HasMaxLength(50);

        //        entity.Property(e => e.Gearbox)
        //            .HasColumnName("gearbox")
        //            .HasMaxLength(50);

        //        entity.Property(e => e.InternalColor)
        //            .HasColumnName("internalColor")
        //            .HasMaxLength(50);

        //        entity.Property(e => e.MakeYear).HasColumnName("makeYear");

        //        entity.Property(e => e.Mileage).HasColumnName("mileage");

        //        entity.Property(e => e.ModelId).HasColumnName("modelId");

        //        entity.HasOne(d => d.Ad)
        //            .WithMany(p => p.AdAttributeTransportation)
        //            .HasForeignKey(d => d.AdId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_AdAttributeTransportation_Advertisements");

        //        entity.HasOne(d => d.Model)
        //            .WithMany(p => p.AdAttributeTransportation)
        //            .HasForeignKey(d => d.ModelId)
        //            .HasConstraintName("FK_AdAttributeTransportation_CarBrands")
        //            ;
        //    });

        //    modelBuilder.Entity<AdPrivilege>(entity =>
        //    {
        //        entity.HasKey(e => new { e.AdId, e.PrivilegeId, e.InsertionDate })
        //            .HasName("PK_AdPrivilage");

        //        entity.Property(e => e.AdId).HasColumnName("adId");

        //        entity.Property(e => e.PrivilegeId).HasColumnName("privilegeId");

        //        entity.Property(e => e.InsertionDate)
        //            .HasColumnName("insertionDate")
        //            .HasColumnType("smalldatetime");

        //        entity.HasOne(d => d.Ad)
        //            .WithMany(p => p.AdPrivilege)
        //            .HasForeignKey(d => d.AdId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_AdPrivilage_Advertisements");

        //        entity.HasOne(d => d.Privilege)
        //            .WithMany(p => p.AdPrivilege)
        //            .HasForeignKey(d => d.PrivilegeId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_AdPrivilege_Privilege");
        //    });

        //    modelBuilder.Entity<AdStatus>(entity =>
        //    {
        //        entity.Property(e => e.AdStatusId)
        //            .HasColumnName("adStatusId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.AdStatus1)
        //            .IsRequired()
        //            .HasColumnName("adStatus")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.AdStatusEnglish)
        //            .IsRequired()
        //            .HasColumnName("adStatusEnglish")
        //            .HasMaxLength(150);
        //    });

        //    modelBuilder.Entity<Advertisements>(entity =>
        //    {
        //        entity.HasKey(e => e.AdId)
        //            .HasName("PK_Advertisements_1");

        //        entity.Property(e => e.AdId)
        //            .HasColumnName("adId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.AdComments)
        //            .IsRequired()
        //            .HasColumnName("adComments")
        //            .HasMaxLength(1000);

        //        entity.Property(e => e.AdInsertDateTime)
        //            .HasColumnName("adInsertDateTime")
        //            .HasColumnType("smalldatetime");

        //        entity.Property(e => e.AdLink)
        //            .IsRequired()
        //            .HasColumnName("adLink")
        //            .HasMaxLength(500);

        //        entity.Property(e => e.AdNumberOfVisited).HasColumnName("adNumberOfVisited");

        //        entity.Property(e => e.AdStatusId).HasColumnName("adStatusId");

        //        entity.Property(e => e.AdTitle)
        //            .IsRequired()
        //            .HasColumnName("adTitle")
        //            .HasMaxLength(250);

        //        entity.Property(e => e.CategoryId).HasColumnName("categoryId");

        //        entity.Property(e => e.DistrictId).HasColumnName("districtId");

        //        entity.HasOne(d => d.AdStatus)
        //            .WithMany(p => p.Advertisements)
        //            .HasForeignKey(d => d.AdStatusId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_Advertisements_AdTypes");

        //        entity.HasOne(d => d.Category)
        //            .WithMany(p => p.Advertisements)
        //            .HasForeignKey(d => d.CategoryId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_Advertisements_Categories");

        //        entity.HasOne(d => d.District)
        //            .WithMany(p => p.Advertisements)
        //            .HasForeignKey(d => d.DistrictId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_Advertisements_Districts");
        //    });

        //    modelBuilder.Entity<AspNetRoleClaims>(entity =>
        //    {
        //        entity.HasIndex(e => e.RoleId)
        //            .HasName("IX_AspNetRoleClaims_RoleId");

        //        entity.Property(e => e.RoleId)
        //            .IsRequired()
        //            .HasMaxLength(450);

        //        entity.HasOne(d => d.Role)
        //            .WithMany(p => p.AspNetRoleClaims)
        //            .HasForeignKey(d => d.RoleId);
        //    });

        //    modelBuilder.Entity<AspNetRoles>(entity =>
        //    {
        //        entity.HasIndex(e => e.NormalizedName)
        //            .HasName("RoleNameIndex")
        //            .IsUnique();

        //        entity.Property(e => e.Id).HasMaxLength(450);

        //        entity.Property(e => e.Name).HasMaxLength(256);

        //        entity.Property(e => e.NormalizedName)
        //            .IsRequired()
        //            .HasMaxLength(256);
        //    });

        //    modelBuilder.Entity<AspNetUserClaims>(entity =>
        //    {
        //        entity.HasIndex(e => e.UserId)
        //            .HasName("IX_AspNetUserClaims_UserId");

        //        entity.Property(e => e.UserId)
        //            .IsRequired()
        //            .HasMaxLength(450);

        //        entity.HasOne(d => d.User)
        //            .WithMany(p => p.AspNetUserClaims)
        //            .HasForeignKey(d => d.UserId);
        //    });

        //    modelBuilder.Entity<AspNetUserLogins>(entity =>
        //    {
        //        entity.HasKey(e => new { e.LoginProvider, e.ProviderKey })
        //            .HasName("PK_AspNetUserLogins");

        //        entity.HasIndex(e => e.UserId)
        //            .HasName("IX_AspNetUserLogins_UserId");

        //        entity.Property(e => e.LoginProvider).HasMaxLength(450);

        //        entity.Property(e => e.ProviderKey).HasMaxLength(450);

        //        entity.Property(e => e.UserId)
        //            .IsRequired()
        //            .HasMaxLength(450);

        //        entity.HasOne(d => d.User)
        //            .WithMany(p => p.AspNetUserLogins)
        //            .HasForeignKey(d => d.UserId);
        //    });

        //    modelBuilder.Entity<AspNetUserRoles>(entity =>
        //    {
        //        entity.HasKey(e => new { e.UserId, e.RoleId })
        //            .HasName("PK_AspNetUserRoles");

        //        entity.HasIndex(e => e.RoleId)
        //            .HasName("IX_AspNetUserRoles_RoleId");

        //        entity.Property(e => e.UserId).HasMaxLength(450);

        //        entity.Property(e => e.RoleId).HasMaxLength(450);

        //        entity.HasOne(d => d.Role)
        //            .WithMany(p => p.AspNetUserRoles)
        //            .HasForeignKey(d => d.RoleId);

        //        entity.HasOne(d => d.User)
        //            .WithMany(p => p.AspNetUserRoles)
        //            .HasForeignKey(d => d.UserId);
        //    });

        //    modelBuilder.Entity<AspNetUserTokens>(entity =>
        //    {
        //        entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name })
        //            .HasName("PK_AspNetUserTokens");

        //        entity.Property(e => e.UserId).HasMaxLength(450);

        //        entity.Property(e => e.LoginProvider).HasMaxLength(450);

        //        entity.Property(e => e.Name).HasMaxLength(450);
        //    });

        //    modelBuilder.Entity<AspNetUsers>(entity =>
        //    {
        //        entity.HasIndex(e => e.NormalizedEmail)
        //            .HasName("EmailIndex");

        //        entity.HasIndex(e => e.NormalizedUserName)
        //            .HasName("UserNameIndex")
        //            .IsUnique();

        //        entity.Property(e => e.Id).HasMaxLength(450);

        //        entity.Property(e => e.Email).HasMaxLength(256);

        //        entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

        //        entity.Property(e => e.NormalizedUserName)
        //            .IsRequired()
        //            .HasMaxLength(256);

        //        entity.Property(e => e.UserName).HasMaxLength(256);
        //    });

        //    modelBuilder.Entity<Brands>(entity =>
        //    {
        //        entity.HasKey(e => e.BrandId)
        //            .HasName("PK_CarMakers");

        //        entity.Property(e => e.BrandId)
        //            .HasColumnName("brandId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.BrandName)
        //            .IsRequired()
        //            .HasColumnName("brandName")
        //            .HasMaxLength(150);
        //    });

        //    modelBuilder.Entity<CarModel>(entity =>
        //    {
        //        entity.HasKey(e => e.ModelId)
        //            .HasName("PK_CarBrand");

        //        entity.Property(e => e.ModelId)
        //            .HasColumnName("modelId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.BrandId).HasColumnName("brandId");

        //        entity.Property(e => e.ModelName)
        //            .IsRequired()
        //            .HasColumnName("modelName")
        //            .HasMaxLength(150);

        //        entity.HasOne(d => d.Brand)
        //            .WithMany(p => p.CarModel)
        //            .HasForeignKey(d => d.BrandId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_CarBrands_Makers");
        //    });

        //    modelBuilder.Entity<Categories>(entity =>
        //    {
        //        entity.HasKey(e => e.CategoryId)
        //            .HasName("PK_Categories");

        //        entity.Property(e => e.CategoryId)
        //            .HasColumnName("categoryId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.CategoryName)
        //            .IsRequired()
        //            .HasColumnName("categoryName")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.CategoryNameEnglish)
        //            .HasColumnName("categoryNameEnglish")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.CategoryParentId)
        //            .HasColumnName("categoryParentId")
        //            .HasColumnType("nchar(10)");
        //    });

        //    modelBuilder.Entity<Cities>(entity =>
        //    {
        //        entity.HasKey(e => e.CityId)
        //            .HasName("PK_Cities");

        //        entity.Property(e => e.CityId)
        //            .HasColumnName("cityId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.CityName)
        //            .IsRequired()
        //            .HasColumnName("cityName")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.ProvinceId).HasColumnName("provinceId");

        //        entity.HasOne(d => d.Province)
        //            .WithMany(p => p.Cities)
        //            .HasForeignKey(d => d.ProvinceId)
        //            .HasConstraintName("FK_Cities_Provinces");
        //    });

        //    modelBuilder.Entity<Districts>(entity =>
        //    {
        //        entity.HasKey(e => e.DistrictId)
        //            .HasName("PK_Districts");

        //        entity.Property(e => e.DistrictId)
        //            .HasColumnName("districtId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.CityId).HasColumnName("cityId");

        //        entity.Property(e => e.DistrictName)
        //            .IsRequired()
        //            .HasColumnName("districtName")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.MunicipalId).HasColumnName("municipalId");

        //        entity.HasOne(d => d.City)
        //            .WithMany(p => p.Districts)
        //            .HasForeignKey(d => d.CityId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_Districts_Cities");
        //    });

        //    modelBuilder.Entity<MobileBrands>(entity =>
        //    {
        //        entity.HasKey(e => e.BrandId)
        //            .HasName("PK_MobileBrands");

        //        entity.Property(e => e.BrandId)
        //            .HasColumnName("brandId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.BrandMakerId).HasColumnName("brandMakerId");

        //        entity.Property(e => e.BrandName)
        //            .IsRequired()
        //            .HasColumnName("brandName")
        //            .HasMaxLength(150);
        //    });

        //    modelBuilder.Entity<Price>(entity =>
        //    {
        //        entity.HasKey(e => e.AdId)
        //            .HasName("PK_Price");

        //        entity.Property(e => e.AdId)
        //            .HasColumnName("adId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.Price1)
        //            .HasColumnName("price")
        //            .HasColumnType("money");

        //        entity.Property(e => e.PriceType)
        //            .HasColumnName("priceType")
        //            .HasMaxLength(150);

        //        entity.HasOne(d => d.Ad)
        //            .WithOne(p => p.Price)
        //            .HasForeignKey<Price>(d => d.AdId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_Price_Advertisements");
        //    });

        //    modelBuilder.Entity<Privilege>(entity =>
        //    {
        //        entity.Property(e => e.PrivilegeId)
        //            .HasColumnName("privilegeId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.PrivilegeName)
        //            .IsRequired()
        //            .HasColumnName("privilegeName")
        //            .HasMaxLength(150);
        //    });

        //    modelBuilder.Entity<Provinces>(entity =>
        //    {
        //        entity.HasKey(e => e.ProvinceId)
        //            .HasName("PK_Provinces");

        //        entity.Property(e => e.ProvinceId)
        //            .HasColumnName("provinceId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.ProvinceCenter)
        //            .HasColumnName("provinceCenter")
        //            .HasMaxLength(150);

        //        entity.Property(e => e.ProvinceName)
        //            .IsRequired()
        //            .HasColumnName("provinceName")
        //            .HasMaxLength(150);
        //    });

        //    modelBuilder.Entity<SimilarAds>(entity =>
        //    {
        //        entity.HasKey(e => new { e.AdId, e.SimilarAdId })
        //            .HasName("PK_SimilarAds");

        //        entity.Property(e => e.AdId).HasColumnName("adId");

        //        entity.Property(e => e.SimilarAdId).HasColumnName("similarAdId");

        //        entity.HasOne(d => d.Ad)
        //            .WithMany(p => p.SimilarAds)
        //            .HasForeignKey(d => d.AdId)
        //            .OnDelete(DeleteBehavior.Restrict)
        //            .HasConstraintName("FK_SimilarAds_Advertisements");
        //    });

        //    modelBuilder.Entity<Sms>(entity =>
        //    {
        //        entity.HasKey(e => e.MessageId)
        //            .HasName("PK_SMS");

        //        entity.ToTable("SMS");

        //        entity.Property(e => e.MessageId)
        //            .HasColumnName("messageId")
        //            .ValueGeneratedNever();

        //        entity.Property(e => e.Message)
        //            .IsRequired()
        //            .HasColumnName("message")
        //            .HasMaxLength(256);

        //        entity.Property(e => e.MessageDate)
        //            .HasColumnName("messageDate")
        //            .HasColumnType("datetime");

        //        entity.Property(e => e.PhoneNumber)
        //            .IsRequired()
        //            .HasColumnName("phoneNumber")
        //            .HasMaxLength(256);

        //        entity.Property(e => e.Sent).HasColumnName("sent");
        //    });

           

           
        }
    }
