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
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    class CategoryApi:ICategoryApi
    {
        public ResponseBase<int> GetServerDataVersion()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<Category[]> GetAllCategories()
        {
            throw new NotImplementedException();
        }
    }
}