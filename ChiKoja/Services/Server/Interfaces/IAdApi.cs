using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface IAdApi
    {
        Task<ResponseBase<AdvertisementCommon[]>> GetAdvertisementCommon();
        Task<ResponseBase<AdvertisementCommon>> GetAdDetail(AdDetailInfo adDetailInfo);
        void ResetSearchCondition();
    }
}