using ModelStd.IRepository;
using StructureMap;
using Microsoft.AspNetCore.Hosting;
using ModelStd.Advertisements;
using MvcMain.Infrastructure.Services;
using RepositoryStd;

namespace MvcMain.Infrastructure.IOC
{
    public  class Bootstrapper
    {
        public static Container container;

       
        public Bootstrapper(IHostingEnvironment env)
        {
            container = new Container(x =>
            {
                //x.For<IRepository>().Use<Repository>();
                //x.For<ISimpleModel>().Use<SimpleModel>().Ctor<int>().Is(250);
                
                string directoryPath =env.ContentRootPath+"/AdvertisementImages/";
                x.For<IImageRepository>().Use<ImageRepositoryFileSystem>().Ctor<string>().Is(directoryPath);
                //x.For<IRepository<AdvertisementCommon>>().Use<AdvertisementCommonRepository>();
                //x.For<IRepository<AdvertisementTransportation>>().Use<AdvertisementTransportationRepository>();
                //x.For<ITransportaionRepository>().Use<TransportationRepository>();

                //x.For<IAdvertisementCommonService>().Use<AdvertisementCommonService>();
                //x.For<IAdvertisementTransportationService>().Use<AdvertisementTransportationService>();
                //x.For<ICategoryRepository>().Use<CategoryRepositoryInCode>();
                //x.For<RegistrationRepository>().Use<RegistrationRepository>();
                //x.For<IEmail>().Use<Email>();
            });
        }
    }
}
