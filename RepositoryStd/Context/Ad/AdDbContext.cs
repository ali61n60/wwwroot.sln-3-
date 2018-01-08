using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ModelStd.Db.Ad;
using SQLitePCL;


namespace RepositoryStd.Context.AD
{
    public partial class AdDbContext : DbContext
    {
        private readonly string _connectionString;

        public AdDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public AdDbContext()
        {
            _connectionString = AdvertisementDataClass.DefaultConnectionString();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString,
                x => x.MigrationsHistoryTable("__MigrationsHistory", "ad"));
        }

        public virtual DbSet<AdAttributeTransportation> AdAttributeTransportation { get; set; }
        public virtual DbSet<AdPrivilege> AdPrivilege { get; set; }
        public virtual DbSet<AdStatus> AdStatus { get; set; }
        public virtual DbSet<Advertisements> Advertisements { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<CarModel> CarModel { get; set; }
        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<Cities> Cities { get; set; }
        public virtual DbSet<Districts> Districts { get; set; }
        public virtual DbSet<MobileBrands> MobileBrands { get; set; }
        public virtual DbSet<Price> Price { get; set; }
        public virtual DbSet<Privilege> Privilege { get; set; }
        public virtual DbSet<Provinces> Provinces { get; set; }
        public virtual DbSet<SimilarAds> SimilarAds { get; set; }
        public virtual DbSet<Sms> Sms { get; set; }
        public virtual DbSet<TemperatureModel> TemperatueModels { get; set; }

       

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdAttributeTransportation>(entity =>
            {
               
                //modelBuilder.Entity<Blog>()
                //    .HasOne(p => p.BlogImage)
                //    .WithOne(i => i.Blog)
                //    .HasForeignKey<BlogImage>(b => b.BlogForeignKey);
                             
                
                entity.HasOne(d => d.Ad)
                    .WithOne(advertisements => advertisements.AdAttributeTransportation)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_AdAttributeTransportation_Advertisements");

                entity.HasOne(d => d.Model)
                    .WithMany(p => p.AdAttributeTransportation)
                    .HasForeignKey(d => d.ModelId)
                    .HasConstraintName("FK_AdAttributeTransportation_CarBrands");
            });

            modelBuilder.Entity<Advertisements>(entity =>
            {
                entity.HasKey(e => e.AdId)
                    .HasName("PK_Advertisements_1");
                
                entity.HasOne(d => d.AdStatus)
                    .WithMany(p => p.Advertisements)
                    .HasForeignKey(d => d.AdStatusId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Advertisements_AdTypes");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Advertisements)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Advertisements_Categories");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.Advertisements)
                    .HasForeignKey(d => d.DistrictId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Advertisements_Districts");
            });

            modelBuilder.Entity<AdPrivilege>(entity =>
            {
                entity.HasKey(e => new { e.AdId, e.PrivilegeId, e.InsertionDate })
                    .HasName("PK_AdPrivilage");

                entity.ToTable("AdPrivilege", "ad");

                entity.Property(e => e.AdId).HasColumnName("adId");

                entity.Property(e => e.PrivilegeId).HasColumnName("privilegeId");

                entity.Property(e => e.InsertionDate)
                    .HasColumnName("insertionDate")
                    .HasColumnType("smalldatetime");

                entity.HasOne(d => d.Ad)
                    .WithMany(p => p.AdPrivilege)
                    .HasForeignKey(d => d.AdId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_AdPrivilage_Advertisements");

                entity.HasOne(d => d.Privilege)
                    .WithMany(p => p.AdPrivilege)
                    .HasForeignKey(d => d.PrivilegeId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_AdPrivilege_Privilege");
            });

            modelBuilder.Entity<AdStatus>(entity =>
            {
                entity.ToTable("AdStatus", "ad");

                entity.Property(e => e.AdStatusId)
                    .HasColumnName("adStatusId")
                    .ValueGeneratedNever();

                entity.Property(e => e.AdStatus1)
                    .IsRequired()
                    .HasColumnName("adStatus")
                    .HasMaxLength(150);

                entity.Property(e => e.AdStatusEnglish)
                    .IsRequired()
                    .HasColumnName("adStatusEnglish")
                    .HasMaxLength(150);
            });

           modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.BrandId)
                    .HasName("PK_CarMakers");
            });

            modelBuilder.Entity<CarModel>(entity =>
            {
                entity.HasKey(e => e.ModelId)
                    .HasName("PK_CarBrand");

                entity.HasOne(d => d.Brand)
                    .WithMany(p => p.CarModel)
                    .HasForeignKey(d => d.BrandId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_CarBrands_Makers");
            });

            modelBuilder.Entity<Categories>(entity =>
            {
                entity.HasKey(e => e.CategoryId)
                    .HasName("PK_Categories");

                entity.ToTable("Categories", "ad");

                entity.Property(e => e.CategoryId)
                    .HasColumnName("categoryId")
                    .ValueGeneratedNever();

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasColumnName("categoryName")
                    .HasMaxLength(150);

                entity.Property(e => e.CategoryNameEnglish)
                    .HasColumnName("categoryNameEnglish")
                    .HasMaxLength(150);

                entity.Property(e => e.CategoryParentId)
                    .HasColumnName("categoryParentId")
                    .HasColumnType("nchar(10)");
            });

            modelBuilder.Entity<Cities>(entity =>
            {
                entity.HasKey(e => e.CityId)
                    .HasName("PK_Cities");

                entity.ToTable("Cities", "ad");

                entity.Property(e => e.CityId)
                    .HasColumnName("cityId")
                    .ValueGeneratedNever();

                entity.Property(e => e.CityName)
                    .IsRequired()
                    .HasColumnName("cityName")
                    .HasMaxLength(150);

                entity.Property(e => e.ProvinceId).HasColumnName("provinceId");

                entity.HasOne(d => d.Province)
                    .WithMany(p => p.Cities)
                    .HasForeignKey(d => d.ProvinceId)
                    .HasConstraintName("FK_Cities_Provinces");
            });

            modelBuilder.Entity<Districts>(entity =>
            {
                entity.HasKey(e => e.DistrictId)
                    .HasName("PK_Districts");

                entity.ToTable("Districts", "ad");

                entity.Property(e => e.DistrictId)
                    .HasColumnName("districtId")
                    .ValueGeneratedNever();

                entity.Property(e => e.CityId).HasColumnName("cityId");

                entity.Property(e => e.DistrictName)
                    .IsRequired()
                    .HasColumnName("districtName")
                    .HasMaxLength(150);

                entity.Property(e => e.MunicipalId).HasColumnName("municipalId");

                entity.HasOne(d => d.City)
                    .WithMany(p => p.Districts)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Districts_Cities");
            });

            modelBuilder.Entity<MobileBrands>(entity =>
            {
                entity.HasKey(e => e.BrandId)
                    .HasName("PK_MobileBrands");

                entity.ToTable("MobileBrands", "ad");

                entity.Property(e => e.BrandId)
                    .HasColumnName("brandId")
                    .ValueGeneratedNever();

                entity.Property(e => e.BrandMakerId).HasColumnName("brandMakerId");

                entity.Property(e => e.BrandName)
                    .IsRequired()
                    .HasColumnName("brandName")
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<Price>(entity =>
            {
               entity.HasOne(d => d.Ad)
                    .WithOne(advertisements => advertisements.Price)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Price_Advertisements");
            });

            modelBuilder.Entity<Privilege>(entity =>
            {
                entity.ToTable("Privilege", "ad");

                entity.Property(e => e.PrivilegeId)
                    .HasColumnName("privilegeId")
                    .ValueGeneratedNever();

                entity.Property(e => e.PrivilegeName)
                    .IsRequired()
                    .HasColumnName("privilegeName")
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<Provinces>(entity =>
            {
                entity.HasKey(e => e.ProvinceId)
                    .HasName("PK_Provinces");

                entity.ToTable("Provinces", "ad");

                entity.Property(e => e.ProvinceId)
                    .HasColumnName("provinceId")
                    .ValueGeneratedNever();

                entity.Property(e => e.ProvinceCenter)
                    .HasColumnName("provinceCenter")
                    .HasMaxLength(150);

                entity.Property(e => e.ProvinceName)
                    .IsRequired()
                    .HasColumnName("provinceName")
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<SimilarAds>(entity =>
            {
                entity.HasKey(e => new { e.AdId, e.SimilarAdId })
                    .HasName("PK_SimilarAds");

                entity.ToTable("SimilarAds", "ad");

                entity.Property(e => e.AdId).HasColumnName("adId");

                entity.Property(e => e.SimilarAdId).HasColumnName("similarAdId");

                entity.HasOne(d => d.Ad)
                    .WithMany(p => p.SimilarAds)
                    .HasForeignKey(d => d.AdId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_SimilarAds_Advertisements");
            });

            modelBuilder.Entity<Sms>(entity =>
            {
                entity.HasKey(e => e.MessageId)
                    .HasName("PK_SMS");

                entity.ToTable("SMS", "ad");

                entity.Property(e => e.MessageId)
                    .HasColumnName("messageId")
                    .ValueGeneratedNever();

                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasColumnName("message")
                    .HasMaxLength(256);

                entity.Property(e => e.MessageDate)
                    .HasColumnName("messageDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasColumnName("phoneNumber")
                    .HasMaxLength(256);

                entity.Property(e => e.Sent).HasColumnName("sent");
            });
        }
        /*
         * 
           protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("ad");
            
            modelBuilder.Entity<AdPrivilege>().HasKey(privilege => new{ privilege.adId,privilege.insertionDate,privilege.privilegeId});
           
            modelBuilder.Entity<SimilarAd>().HasKey(ad =>new{ ad.adId,ad.similarAdId});
        }
         * */
    }
}