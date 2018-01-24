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
        IQueryable<Db.Ad.Advertisement> GetCommonQueryableList(Dictionary<string, string> queryParameters);
        IQueryable<Db.Ad.Advertisement> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters,IQueryable<Db.Ad.Advertisement> list);
        void FillAdvertisementCommonFromDatabaseResult(Db.Ad.Advertisement advertisement, AdvertisementCommon adCommon);
        Db.Ad.Advertisement GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary);
        Task IncrementNumberOfVisit(Guid adGuid);
        Db.Ad.Advertisement GetAdvertisement(AdvertisementCommon advertisementCommon);
        Task<IEnumerable<AdvertisementCommon>> GetUserAdvertisements(string userId);//In Progress

        Task UpdateAd(Guid adGuid, string userId);
        Task DeleteAd(Guid adGuid, string userId);
        Task MarkAd(Guid adGuid, string userId);
        List<LetMeKnow> GetUserLetMeKnows(string userId);
        Task DeleteLetMeKnow(int letMeKnowId, string userId);
        LetMeKnow GetLetMeKnowFormUserInput(Dictionary<string, string> userInputDictionary, string userId);
    }
}
