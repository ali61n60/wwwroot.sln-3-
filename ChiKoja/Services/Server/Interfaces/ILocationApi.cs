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
using ModelStd.Advertisements.Location;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface ILocationApi
    {
        Task<ResponseBase<int>> GetLocationyVersion();
        ResponseBase<Province[]> GetAllProvinces();
        ResponseBase<District[]> GetAllDistricts();
        ResponseBase<City[]> GetAllCities();
    }
}