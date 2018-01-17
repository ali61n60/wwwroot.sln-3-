using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ModelStd.Db.Identity;

namespace RepositoryStd.Context.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {
        private readonly string _connectionString;
        
        public AppIdentityDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        public AppIdentityDbContext()
        {
            _connectionString = AdvertisementDataClass.DefaultConnectionString();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString,
                x => x.MigrationsHistoryTable("__MigrationsHistory", "identity"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("identity");


            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(aspNetUserLogins =>
                    new { aspNetUserLogins.LoginProvider, aspNetUserLogins.ProviderKey }
                ).HasName("PK_AspNetUserLogins");

            });

        }
     

        public static async Task CreateAdminAccount(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            UserManager<AppUser> userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
            RoleManager<IdentityRole> roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string username = configuration["Data:AdminUser:Name"];
            string email = configuration["Data:AdminUser:Email"];
            string password = configuration["Data:AdminUser:Password"];
            string role = configuration["Data:AdminUser:Role"];
            if (await userManager.FindByNameAsync(username) == null)
            {
                if (await roleManager.FindByNameAsync(role) == null)
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
                AppUser user = new AppUser
                {
                    UserName = username,
                    Email = email
                };

                IdentityResult result = await userManager
                    .CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }
    }
}
