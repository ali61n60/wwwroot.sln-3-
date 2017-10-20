using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
   public interface IAdvertisementService<T>
    {
        //TODO it is a two-step process 1- get T based on category Id and use a generic factory based on T
       ResponseBase<AdvertisementCommon[]> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput );
        ResponseBase<T> GetAdDetail(Guid adId);
    }
}
