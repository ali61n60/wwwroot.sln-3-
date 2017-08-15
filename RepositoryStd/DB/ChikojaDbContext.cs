using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace RepositoryStd.DB
{
    public class Brand
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
    }
    public class ChikojaDbContext:DbContext
    {

        public ChikojaDbContext():base()
        {
           
        }
        public DbSet<Brand> Brands { get; set; }
    }
}
