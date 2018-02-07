using System;
using Android.Content;

namespace ChiKoja.AdDetail
{
    class AdDetail
    {
        public static readonly string AdGuidKey = "AdGuid";
        const int Transportaion = 100;
        public static void ShowAdDetail(Guid adGuid, int categoryId,Context context)
        {
            switch (categoryId)
            {
                case Transportaion:
                    showTransportationDetail(adGuid,context);
                    break;
            }
        }

        private static void showTransportationDetail(Guid adGuid,Context context)
        {
            Intent transportationIntent=new Intent(context,typeof(AdDetailTransportationActivity));
            transportationIntent.PutExtra(AdGuidKey, adGuid.ToString());
            context.StartActivity(transportationIntent);
        }
    }
}