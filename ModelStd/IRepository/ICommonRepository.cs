using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;


namespace ModelStd.IRepository
{
    //Implemented by AdvertisementCommonRepository
    public interface ICommonRepository
    {
        IQueryable<Advertisement> GetCommonQueryableList(Dictionary<string, string> queryParameters);
        IQueryable<Advertisement> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters,IQueryable<Advertisement> list);
        
        Advertisement GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary);
        Task IncrementNumberOfVisit(Guid adGuid);
        Advertisement GetAdvertisement(AdvertisementCommon advertisementCommon);
        Task<IEnumerable<AdvertisementCommon>> GetUserAdvertisements(string userId);//In Progress

        Task UpdateAd(Guid adGuid, string userId);
        Task DeleteAd(Guid adGuid, string userId);
        Task MarkAd(Guid adGuid, string userId);
        List<LetMeKnow> GetUserLetMeKnows(string userId);
        Task DeleteLetMeKnow(int letMeKnowId, string userId);
        LetMeKnow GetLetMeKnowFormUserInput(Dictionary<string, string> userInputDictionary, string userId);
    }
}
