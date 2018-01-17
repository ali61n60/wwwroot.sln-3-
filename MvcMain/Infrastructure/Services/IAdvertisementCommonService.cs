using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace MvcMain.Infrastructure.Services
{
    //TODO 2- try to refactor or remove this interface
    public interface IAdvertisementCommonService
    {
       
        //Done
       ResponseBase RemoveAdvertisement(AdvertisementCommon advertisementCommon);

        //Done
        ResponseBase ExtendAdvertisement(AdvertisementCommon advertisement);

        Task<ResponseBase> IncrementNumberOfVisit(Guid adGuid);
        
        void FillFirstImage(IEnumerable<AdvertisementCommon> advertisementCommons);//Done
        void FillAllImages(AdvertisementCommon[] advertisementCommons);//Done
        void FillAllImages(AdvertisementCommon advertisementCommon);//Done
        ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon); //Done
    }
}