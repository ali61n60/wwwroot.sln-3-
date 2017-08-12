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
            return await ServicesCommon.CallService<int>("/api/CategoryApiController/GetServerDataVersion");
        }

        public Task<ResponseBase<Category[]>> GetAllCategories()
        {
            throw new NotImplementedException();
        }
    }
}