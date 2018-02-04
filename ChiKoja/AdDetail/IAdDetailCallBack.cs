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

namespace ChiKoja.AdDetail
{
    public interface IAdDetailCallBack<T>
    {
        void DataFromServer(T t);
    }
}