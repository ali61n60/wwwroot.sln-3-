using Microsoft.EntityFrameworkCore;
using ModelStd.Db.Ad;

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

        public virtual DbSet<AdAttributeTransportation> AdAttributeTransportations { get; set; }
        public virtual DbSet<AdPrivilege> AdPrivileges { get; set; }
        public virtual DbSet<AdStatus> AdStatus { get; set; }
        public virtual DbSet<Advertisement> Advertisements { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<CarModel> CarModels { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<District> Districts { get; set; }
        public virtual DbSet<MobileBrand> MobileBrands { get; set; }
        public virtual DbSet<Privilege> Privileges { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<SimilarAd> SimilarAds { get; set; }
        public virtual DbSet<SM> SMS { get; set; }
        public virtual DbSet<Price> Prices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("ad");
            
            modelBuilder.Entity<AdPrivilege>().HasKey(privilege => new{ privilege.adId,privilege.insertionDate,privilege.privilegeId});
           
            modelBuilder.Entity<SimilarAd>().HasKey(ad =>new{ ad.adId,ad.similarAdId});
        }
    }
}
