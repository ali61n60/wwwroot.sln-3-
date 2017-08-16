using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace RepositoryStd.DB
{

    public class TemporaryDbContextFactory : IDbContextFactory<ChikojaDbContext>
    {
        public ChikojaDbContext Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<ChikojaDbContext>();
            builder.UseSqlServer(
                "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true");
            //builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=pinchdb;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new ChikojaDbContext(builder.Options);
        }
    }




    public class ChikojaDbContext:DbContext
    {

        public ChikojaDbContext(DbContextOptions options):base(options)
        {
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


    [Table("Price")]
    public class Price
    {
        [Key]
        public Guid adId { get; set; }

        [StringLength(150)]
        public string priceType { get; set; }

        [Column("price", TypeName = "money")]
        public decimal? price1 { get; set; }
    }

}
