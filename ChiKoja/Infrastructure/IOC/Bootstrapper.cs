using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
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
                
                //x.For<IRepository>().Use<Repository>();
                //x.For<ISimpleModel>().Use<SimpleModel>().Ctor<int>().Is(250);
                //string directoryPath = HttpContext.Current.Server.MapPath("~/AdvertisementImages/");
                //x.For<IImageRepository>().Use<ImageRepositoryFileSystem>().Ctor<string>().Is(directoryPath);
                
            });
        }
    }
}