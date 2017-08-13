using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public async Task<ResponseBase<int>> GetServerDataVersion()
        {
            return await ServicesCommon.CallService<int>("api/CategoryApi/GetServerDataVersion");
        }

        public async Task<ResponseBase<Category[]>> GetAllCategories()
        {
            return await ServicesCommon.CallService<Category[]>("api/CategoryApi/GetAllCategories");
        }
    }
}