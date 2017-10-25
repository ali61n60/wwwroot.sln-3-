using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
   public interface IAdvertisementService
    {
        ResponseBase<IList<AdvertisementCommon>> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput );
    }
}
