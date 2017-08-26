using System;
using Microsoft.EntityFrameworkCore;
using ModelStd.DB;

namespace RepositoryStd.DB
{
    public class DbContextFactory
    {
        private readonly string _connectionString;
        public DbContextFactory(string connectionString)
        {
            _connectionString = connectionString;
        }
        public T Create<T>() where T:DbContext,new()
        {
            var builder = new DbContextOptionsBuilder();
            builder.UseSqlServer(_connectionString);
            return (T)Activator.CreateInstance(typeof(T), new object[] { builder.Options });
        }
    }

    public class AdCommonDbContext:DbContext
    {
        public AdCommonDbContext() { }
        public AdCommonDbContext(DbContextOptions options):base(options)
        {
           
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdPrivilege>()
                .HasKey(privilege => new {privilege.adId, privilege.privilegeId, privilege.insertionDate});
            modelBuilder.Entity<SimilarAd>()
                .HasKey(ad => new {ad.adId,ad.similarAdId });
        }

        public DbSet<Price> Prices { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<CarModel> CarModels { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Province> Provinces { get; set; }
    }


    

}
