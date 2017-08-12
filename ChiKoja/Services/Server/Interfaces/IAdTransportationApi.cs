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
using ModelStd.Advertisements;
using ModelStd.Advertisements.Transportation;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface IAdTransportationApi
    {
        Task<ResponseBase<int>> GetServerDataVersion();
        Task<ResponseBase<TransportationModel[]>> GetAllTransportationModels();
        Task<ResponseBase<TransportationBrand[]>> GetAllTransportationBrands();

        ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation adTransportation,
            string encryptWithServerKey, string s);
    }
}