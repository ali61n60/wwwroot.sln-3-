using Model.Advertisements;
using System.Collections.Generic;
using WcfService.Messages;

namespace WcfService.Services
{
   public interface IAdvertisementService
    {
       ResponseBase<AdvertisementCommon[]> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput );
       ResponseBase RemoveAd(AdvertisementCommon advertisementCommon); 

    }
}
