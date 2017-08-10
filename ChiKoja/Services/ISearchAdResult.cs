using System;
using ChiKoja.AdCommonService;
using ModelStd.Services;

namespace ChiKoja.Services
{
    public interface ISearchAdResult
    {
        void OnSerachAdCompleted(ResponseBase<AdvertisementCommon> response,bool inResponseToLastRequest);
        void OnSearchAdError(Exception ex);
    }
}