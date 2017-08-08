using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using ChiKoja.AdCommonService;

namespace ChiKoja.Services
{
    public interface ISearchAdResult
    {
        void OnSerachAdCompleted(ResponseBaseOfArrayOfAdvertisementCommongJiz6K1p response,bool InResponseToLastRequest);
        void OnSearchAdError(Exception ex);
    }
}