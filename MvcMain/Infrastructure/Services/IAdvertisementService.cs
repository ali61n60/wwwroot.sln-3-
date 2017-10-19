﻿using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
   public interface IAdvertisementService
    {
       ResponseBase<AdvertisementCommon[]> GetAdvertisements(int startIndex, int count, Dictionary<string, string> userInput );
        ResponseBase<AdvertisementCommon> GetAdDetail(Guid adId);
    }
}
