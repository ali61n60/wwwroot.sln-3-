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
using ModelStd.Advertisements.Transportation;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    class AdTransportationApi:IAdTransportationApi
    {
        public ResponseBase<int> GetServerDataVersion()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<TransportationModel[]> GetAllTransportationModels()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<TransportationBrand[]> GetAllTransportationBrands()
        {
            throw new NotImplementedException();
        }

        public ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation adTransportation, string encryptWithServerKey, string s)
        {
            throw new NotImplementedException();
        }
    }
}