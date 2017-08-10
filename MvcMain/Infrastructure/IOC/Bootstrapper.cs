using ModelStd.IRepository;
using StructureMap;
using Microsoft.AspNetCore.Hosting;
using ModelStd.Advertisements;
using MvcMain.Infrastructure.Services;
using RepositoryStd;

namespace MvcMain.Infrastructure.IOC
{
    public class Bootstrapper
    {
        public static Container container;
        private static IHostingEnvironment env;


        static Bootstrapper()
        {
            container = new Container(x =>
            {
                //x.For<IRepository>().Use<Repository>();
                //x.For<ISimpleModel>().Use<SimpleModel>().Ctor<int>().Is(250);
                
                
               
                
                

                
                //x.For<IAdvertisementTransportationService>().Use<AdvertisementTransportationService>();
                //x.For<ICategoryRepository>().Use<CategoryRepositoryInCode>();
                //x.For<RegistrationRepository>().Use<RegistrationRepository>();
                //x.For<IEmail>().Use<Email>();
            });
        }
    }
}
