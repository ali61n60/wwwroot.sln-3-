using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface IAdApi
    {
        Task<ResponseBase<AdvertisementCommon[]>> GetAdvertisementCommon();
        void ResetSearchCondition();
    }
}