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
using ChiKoja.AdTransportationService;

namespace ChiKoja.Services
{
    public interface ISearchAdTransportationResult
    {
        void OnSerachAdCompleted(ResponseBaseOfAdvertisementTransportationgJiz6K1p response);
        void OnSearchAdError(Exception ex);
    }
}