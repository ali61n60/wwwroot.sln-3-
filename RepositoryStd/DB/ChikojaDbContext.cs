using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace RepositoryStd.DB
{
    
    public class ChikojaDbContext:DbContext
    {

        public ChikojaDbContext(DbContextOptions options):base(options)
        {
          
        }
        public DbSet<Price> Prices { get; set; }
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
