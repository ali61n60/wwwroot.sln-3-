using System;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Services
{
    public interface ISearchAdResult
    {
        void OnSerachAdCompleted(ResponseBase<AdvertisementCommon[]> response);
        void OnSearchAdError(Exception ex);
    }
}