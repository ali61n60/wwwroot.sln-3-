using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd.Advertisements;


namespace ModelStd.IRepository
{
    //Implemented by AdvertisementCommonRepository
    public interface ICommonRepository
    {
        IQueryable<Db.Ad.Advertisements> GetCommonQueryableList(Dictionary<string, string> queryParameters);
        IQueryable<Db.Ad.Advertisements> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters,IQueryable<Db.Ad.Advertisements> list);
        void FillAdvertisementCommonFromDatabaseResult(Db.Ad.Advertisements advertisement, AdvertisementCommon adCommon);
        Db.Ad.Advertisements GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary);
        Task IncrementNumberOfVisit(Guid adGuid);
        Db.Ad.Advertisements GetAdvertisement(AdvertisementCommon advertisementCommon);
        Task<IEnumerable<AdvertisementCommon>> GetUserAdvertisements(string userId);//In Progress

        Task UpdateAd(Guid adGuid, string userId);
        Task DeleteAd(Guid adGuid, string userId);
        Task MarkAd(Guid adGuid, string userId);
    }
}
