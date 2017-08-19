using System;
using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace MvcMain.Infrastructure.Services
{
    
    public interface IAdvertisementCommonService
    {
        //Done
        ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon(int startIndex, int count, Dictionary<string, string> userInput);
        
        //Done
       ResponseBase<AdvertisementCommon[]> GetCustomerAdvertisementCommon(string userName,string password,bool userPassIsEncrypted);
        
        //Done
       ResponseBase RemoveAdvertisement(AdvertisementCommon advertisementCommon);

        //Done
        ResponseBase ExtendAdvertisement(AdvertisementCommon advertisement);

        ResponseBase IncrementNumberOfVisit(Guid adGuid);
        
        
        void FillFirstImage(AdvertisementCommon[] advertisementCommons);//Done
        void FillFirstImage(AdvertisementCommon advertisementCommon);//Done
        void FillAllImages(AdvertisementCommon[] advertisementCommons);//Done
        void FillAllImages(AdvertisementCommon advertisementCommon);//Done
        ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon); //Done
    }
}