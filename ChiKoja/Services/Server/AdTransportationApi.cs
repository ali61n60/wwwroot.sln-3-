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
using ModelStd.Advertisements.Transportation;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    class AdTransportationApi:IAdTransportationApi
    {
        public async Task<ResponseBase<int>> GetServerDataVersion()
        {
            return await ServicesCommon.CallService<int>("api/AdTransportationApi/GetServerDataVersion");
        }

        public async Task<ResponseBase<TransportationModel[]>> GetAllTransportationModels()
        {
            return await ServicesCommon.CallService<TransportationModel[]>("api/AdTransportationApi/GetAllTransportationModels");
        }

        public async Task<ResponseBase<TransportationBrand[]>> GetAllTransportationBrands()
        {
            return await ServicesCommon.CallService<TransportationBrand[]>("api/AdTransportationApi/GetAllTransportationBrands");
        }

        public ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation adTransportation, string encryptWithServerKey, string s)
        {
            throw new NotImplementedException();
        }

        
    }
}