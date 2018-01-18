using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ModelStd.Db.Ad;


namespace RepositoryStd.Context.AD
{
    public class AdDbContext : DbContext
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
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<District> Districts { get; set; }
        public virtual DbSet<MobileBrands> MobileBrands { get; set; }
        public virtual DbSet<Price> Price { get; set; }
        public virtual DbSet<Privilege> Privilege { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<SimilarAds> SimilarAds { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Temperature> Temperatures { get; set; }
        public virtual DbSet<MarkedAd> MarkedAds { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("ad");

            modelBuilder.Entity<AdAttributeTransportation>(entity =>
            {

                //modelBuilder.Entity<Blog>()
                //    .HasOne(p => p.BlogImage)
                //    .WithOne(i => i.Blog)
                //    .HasForeignKey<BlogImage>(b => b.BlogForeignKey);


                entity.HasOne(d => d.Ad)
                    .WithOne(advertisements => advertisements.AdAttributeTransportation)
                    .OnDelete(DeleteBehavior.Cascade)
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

                entity.HasOne(d => d.Ad)
                    .WithMany(p => p.AdPrivilege)
                    .HasForeignKey(d => d.AdId)
                    .OnDelete(DeleteBehavior.Cascade)
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


                //TODO make its type int
                entity.Property(e => e.CategoryParentId)
                     .HasColumnType("nchar(10)");
            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.HasOne(d => d.Province)
                     .WithMany(p => p.Cities)
                     .HasForeignKey(d => d.ProvinceId)
                     .HasConstraintName("FK_Cities_Provinces");
            });

            modelBuilder.Entity<District>(entity =>
            {
                entity.HasOne(d => d.City)
                    .WithMany(p => p.Districts)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Districts_Cities");
            });

            modelBuilder.Entity<MarkedAd>(entity =>
            {
                entity.HasKey(markedAd =>
                    new { markedAd.AdId, markedAd.UserId }
                ).HasName("PK_MarkedAd");

                entity.HasOne(markedAd => markedAd.Ad)
                    .WithMany(advertisements => advertisements.MarkedAds)
                    .HasForeignKey(markedAd => markedAd.AdId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_MarkedAds_Advertisements");

                entity.HasOne(markedAd => markedAd.User)
                    .WithMany(appUser => appUser.MarkedAds)
                    .HasForeignKey(markedAd => markedAd.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_MarkedAds_AspNetUsers");
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
                     .OnDelete(DeleteBehavior.Cascade)
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

            modelBuilder.Entity<SimilarAds>(entity =>
             {
                 entity.HasKey(e => new { e.AdId, e.SimilarAdId })
                     .HasName("PK_SimilarAds");

                 entity.HasOne(d => d.Ad)
                     .WithMany(p => p.SimilarAds)
                     .HasForeignKey(d => d.AdId)
                     .OnDelete(DeleteBehavior.Cascade)
                     .HasConstraintName("FK_SimilarAds_Advertisements");
             });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.MessageId)
                    .HasName("PK_Message");

                entity.HasOne(m => m.User)
                    .WithMany()
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasForeignKey(message => message.UserId);
            });

        }
    }
}