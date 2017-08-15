using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ModelStd.Advertisements;
using ModelStd.IRepository;
using MvcMain.Infrastructure.Services;
using MvcMain.Models;
using RepositoryStd;
using RepositoryStd.Repository;
using RepositoryStd.Repository.TransportationRepository;

namespace MvcMain
{
    public class Startup
    {
        IConfigurationRoot _configuration;
        private IHostingEnvironment _env;

        public Startup(IHostingEnvironment env)
        {
            _env = env;
            _configuration = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json").Build();
            
        }

        public void ConfigureServices(IServiceCollection services)
        {
            string directoryPath = _env.ContentRootPath + "/AdvertisementImages/";
            services.AddTransient<IImageRepository>(provider => new ImageRepositoryFileSystem(directoryPath));
            services.AddTransient<IRepository<AdvertisementCommon>, AdvertisementCommonRepository>();
            services.AddTransient<IRepository<AdvertisementTransportation>, AdvertisementTransportationRepository>();
            services.AddTransient<IAdvertisementCommonService,AdvertisementCommonService>();
            services.AddTransient<ITransportaionRepository,TransportationRepository>();
            services.AddTransient<ICategoryRepository,CategoryRepositoryInCode>();
            services.AddTransient<ITransportaionRepository,TransportationRepository>();
            services.AddSingleton<AdvertisementDataClass>(provider => new AdvertisementDataClass(_configuration["Data:ConnectionString"]));

            
            services.AddDbContext<AppIdentityDbContext>(options =>
                options.UseSqlServer(_configuration["Data:ConnectionString"]));

            services.AddIdentity<AppUser, IdentityRole>(options =>
                {
                    options.Password.RequireUppercase = false;
                    options.User.RequireUniqueEmail = true;
                    options.Cookies.ApplicationCookie.Events =
                        new CookieAuthenticationEvents
                        {
                            OnRedirectToLogin = context =>
                            {
                                if (context.Request.Path.StartsWithSegments("/api") &&
                                    context.Response.StatusCode == (int)HttpStatusCode.OK)
                                {
                                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                                    context.Response.ContentType = "application/json";
                                    context.Response.WriteAsync("\"What did you say?\"");
                                }
                                else
                                    context.Response.Redirect(context.RedirectUri);
                                return Task.CompletedTask;
                            }
                        };
                }
                ).AddEntityFrameworkStores<AppIdentityDbContext>();
            
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseStatusCodePages();
            app.UseStaticFiles();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtBearer:Key"])),
                    ValidAudience = _configuration["JwtBearer:SiteUrl"],
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = _configuration["JwtBearer:SiteUrl"]
                }
            });
            app.UseIdentity();
            app.UseMvcWithDefaultRoute();
            AppServiceProvider.Instance = app.ApplicationServices;
        }
    }

    public static class AppServiceProvider
    {
        public static IServiceProvider Instance { get; set; }
    }
}
