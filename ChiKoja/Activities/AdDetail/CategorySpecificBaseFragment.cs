using Android.Support.V4.App;
using ModelStd.Advertisements;

namespace ChiKoja.Activities.AdDetail
{
    public abstract class CategorySpecificBaseFragment:Fragment
    {
        public abstract void SetAdDetailData(AdvertisementCommon adDetail);
    }
}