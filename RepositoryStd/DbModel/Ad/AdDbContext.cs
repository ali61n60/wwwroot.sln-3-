using Microsoft.EntityFrameworkCore;
using ModelStd.Db;

namespace Model.Db.Ad
{
   

    public partial class AdDbContext : DbContext
    {
        private string _queryString;

        public AdDbContext(string queryString)
        {
            _queryString = queryString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_queryString);
        }

        public virtual DbSet<AdAttributeTransportation> AdAttributeTransportations { get; set; }
        public virtual DbSet<AdPrivilege> AdPrivileges { get; set; }
        public virtual DbSet<AdStatu> AdStatus { get; set; }
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
            modelBuilder.Entity<AdStatu>()
                .HasMany(e => e.Advertisements)
                //.WithRequired(e => e.AdStatu)
                //.WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdAttributeTransportations)
                //.WithRequired(e => e.Advertisement)
                //.WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdPrivileges)
                //.WithRequired(e => e.Advertisement)
                // .WillCascadeOnDelete(false);
                ;

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.SimilarAds)
                // .WithRequired(e => e.Advertisement)
                // .WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Brand>()
                .HasMany(e => e.CarModels)
                //.WithRequired(e => e.Brand)
                //.WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Category>()
                .Property(e => e.categoryParentId)
                //.IsFixedLength();
                ;
            modelBuilder.Entity<Category>()
                .HasMany(e => e.Advertisements)
                // .WithRequired(e => e.Category)
                // .WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<City>()
                .HasMany(e => e.Districts)
                // .WithRequired(e => e.City)
                // .WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<District>()
                .HasMany(e => e.Advertisements)
                // .WithRequired(e => e.District)
                // .WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Privilege>()
                .HasMany(e => e.AdPrivileges)
                //.WithRequired(e => e.Privilege)
                // .WillCascadeOnDelete(false);
                ;
            modelBuilder.Entity<Price>()
                .Property(e => e.price1)
                // .HasPrecision(19, 4);
                ;
        }
    }
}
