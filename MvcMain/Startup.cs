﻿using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ModelStd.Advertisements;
using ModelStd.Db.Identity;
using ModelStd.IRepository;
using MvcMain.Controllers;
using MvcMain.Infrastructure;
using MvcMain.Infrastructure.Services;
using RepositoryStd;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Identity;
using RepositoryStd.Repository;
using RepositoryStd.Repository.Common;
using RepositoryStd.Repository.Transportation;
using RepositoryStd.TepmeratureRepository;


namespace MvcMain
{
    //Update-Package RepositoryStd -ProjectName MvcMain -reinstall
    //TODO research for singleton dbContext
    public class Startup
    {
        readonly IConfigurationRoot _configuration;
        private readonly IHostingEnvironment _env;
        private AdvertisementDataClass _advertisementDataClass;
        private ICategoryRepository _categoryRepository;
        private AdDbContext _adDbContext;
        private AppIdentityDbContext _appIdentityDbContext;

        public Startup(IHostingEnvironment env)
        {
            _env = env;
            _configuration = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json").Build();


        

        


        }

        public void ConfigureServices(IServiceCollection services)
        {
            _advertisementDataClass = new AdvertisementDataClass(_configuration["Data:ConnectionString"]);
            services.AddSingleton(provider => _advertisementDataClass);

            _categoryRepository = new CategoryRepositoryInCode();
            services.AddTransient<ICategoryRepository>(provider => _categoryRepository);

            string directoryPath = _env.ContentRootPath + "/AdvertisementImages/";
            services.AddTransient<IImageRepository>(provider => new ImageRepositoryFileSystem(directoryPath));

            _adDbContext = new AdDbContext(_configuration["Data:ConnectionString"]);
            _appIdentityDbContext = new AppIdentityDbContext(_configuration["Data:ConnectionString"]);
            services.AddTransient<IRepository<AdvertisementCommon>>(provider =>
            new AdvertisementCommonRepository(_adDbContext, _appIdentityDbContext, _categoryRepository));

            services.AddTransient<ICommonRepository>(provider =>
            new AdvertisementCommonRepository(_adDbContext, _appIdentityDbContext, _categoryRepository));

            services.AddTransient<IRepository<AdvertisementTransportation>>(provider =>
            new AdvertisementTransportationRepository(_adDbContext, _appIdentityDbContext, MyService.Inst.GetService<ICommonRepository>()));
            addRepositoryContainer(services, _adDbContext, _appIdentityDbContext, _categoryRepository);

            services.AddTransient<TemperatureRepository>(provider => new TemperatureRepository(_adDbContext));
            services.AddTransient<ILocationRepository>(provider => new LocationRepository(_adDbContext));
            services.AddTransient<ITransportaionRepository>(provider => new TransportationRepository(_configuration["Data:ConnectionString"]));

            services.AddTransient<IAdvertisementCommonService>(provider => new AdApiController());
            services.AddTransient<IAdvertisementTransportationService>(provider => new AdTransportationApiController());

            services.AddTransient<CategoryApiController>();
            services.AddTransient<LocationApiController>();

            services.AddTransient<AdDbContext>(provider => new AdDbContext(_configuration["Data:ConnectionString"]));

            services.AddTransient<AppIdentityDbContext>(provider => new AppIdentityDbContext(_configuration["Data:ConnectionString"]));
            services.AddTransient<AdApiController>();
            services.AddTransient<UserAdApiController>();

            services.AddSingleton<Infrastructure.ILogger>(provider =>new Logger(_env.ContentRootPath + "/LogData/"));

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

        private void addRepositoryContainer(IServiceCollection services,
            AdDbContext adDbContext, AppIdentityDbContext appIdentityDbContext, ICategoryRepository categoryRepository)
        {
            RepositoryContainer repositoryContainer = new RepositoryContainer(int.Parse(_configuration["Data:DefaultCategoryId"]));
            IAdRepository defaulyAdRepository = new AdvertisementCommonRepository(adDbContext, appIdentityDbContext, categoryRepository);
            repositoryContainer.RegisterRepository(0, defaulyAdRepository);

            IAdRepository adTaransportationAdRepository =
                new AdvertisementTransportationRepository(adDbContext, appIdentityDbContext,
                new AdvertisementCommonRepository(adDbContext, appIdentityDbContext, categoryRepository));
            repositoryContainer.RegisterRepository(100, adTaransportationAdRepository);
            services.AddTransient<RepositoryContainer>(provider => repositoryContainer);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //if (env.IsDevelopment())
            //{
            app.UseDeveloperExceptionPage();
            //}
            app.UseStatusCodePages();
            app.UseStaticFiles();

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
            MyService.Inst = app.ApplicationServices;
            AppIdentityDbContext.CreateAdminAccount(app.ApplicationServices,
                _configuration).Wait();

        }
    }

    public static class MyService
    {
        public static IServiceProvider Inst { get; set; }
    }
}
