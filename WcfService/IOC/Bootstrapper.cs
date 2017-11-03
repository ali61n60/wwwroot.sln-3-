using Model.IRepository;
using Repository;
using StructureMap;
using System.Web;
using WcfService.Services;
using Model.Advertisements;
using Repository.Repository;
using Repository.Repository.TransportationRepository;

namespace WcfService.IOC
{
    public static class Bootstrapper
    {
        public static Container container;
        static Bootstrapper()
        {
            container = new Container(x =>
            {
                //x.For<IRepository>().Use<Repository>();
                //x.For<ISimpleModel>().Use<SimpleModel>().Ctor<int>().Is(250);
                string directoryPath = HttpContext.Current.Server.MapPath("~/AdvertisementImages/");
                x.For<IImageRepository>().Use<ImageRepositoryFileSystem>().Ctor<string>().Is(directoryPath);
                x.For<IRepository<AdvertisementCommon>>().Use<AdvertisementCommonRepository>();
                x.For<IRepository<AdvertisementTransportation>>().Use<AdvertisementTransportationRepository>();
                x.For<ITransportaionRepository>().Use<TransportationRepository>();

                x.For<IAdvertisementCommonService>().Use<AdvertisementCommonService>();
                x.For<IAdvertisementTransportationService>().Use<AdvertisementTransportationService>();
                x.For<ICategoryRepository>().Use<CategoryRepositoryInCode>();
                x.For<RegistrationRepository>().Use<RegistrationRepository>();
                
            });
        }
    }
}
