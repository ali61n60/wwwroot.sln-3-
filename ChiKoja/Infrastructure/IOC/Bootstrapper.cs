using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ChiKoja.Services.Server.Interfaces;
using StructureMap;

namespace ChiKoja.Infrastructure.IOC
{
    public static class Bootstrapper
    {
        public static Container container;

        static Bootstrapper()
        {
            container = new Container(x =>
            {
                x.ForConcreteType<Repository.Repository>().Configure.Singleton();
                x.For<IAdApi>().Use<AdApi>();
                x.For<ISharedPreferences>().Use(PreferenceManager.GetDefaultSharedPreferences(Application.Context));
                //x.For<IRepository>().Use<Repository>();
                //x.For<ISimpleModel>().Use<SimpleModel>().Ctor<int>().Is(250);
                //string directoryPath = HttpContext.Current.Server.MapPath("~/AdvertisementImages/");
                //x.For<IImageRepository>().Use<ImageRepositoryFileSystem>().Ctor<string>().Is(directoryPath);

            });
        }
    }
}