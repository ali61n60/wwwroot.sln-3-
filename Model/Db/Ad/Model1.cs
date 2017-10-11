namespace Model.Db.Ad
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model1")
        {
        }

        public virtual DbSet<C__MigrationsHistory> C__MigrationsHistory { get; set; }
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

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdStatu>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.AdStatu)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdAttributeTransportations)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.AdPrivileges)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Advertisement>()
                .HasMany(e => e.SimilarAds)
                .WithRequired(e => e.Advertisement)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Brand>()
                .HasMany(e => e.CarModels)
                .WithRequired(e => e.Brand)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Category>()
                .Property(e => e.categoryParentId)
                .IsFixedLength();

            modelBuilder.Entity<Category>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.Category)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<City>()
                .HasMany(e => e.Districts)
                .WithRequired(e => e.City)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<District>()
                .HasMany(e => e.Advertisements)
                .WithRequired(e => e.District)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Privilege>()
                .HasMany(e => e.AdPrivileges)
                .WithRequired(e => e.Privilege)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Price>()
                .Property(e => e.price1)
                .HasPrecision(19, 4);
        }
    }
}
