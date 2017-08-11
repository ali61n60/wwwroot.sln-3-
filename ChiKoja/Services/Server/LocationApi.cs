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
using ModelStd.Advertisements.Location;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    public class LocationApi
    {
        public ResponseBase<int> GetLocationyVersion()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<Province[]> GetAllProvinces()
        {
            throw new NotImplementedException();
        }
    }
}