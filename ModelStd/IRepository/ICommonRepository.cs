using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd.Advertisements;


namespace ModelStd.IRepository
{
    public interface ICommonRepository
    {
        IQueryable<Db.Ad.Advertisements> GetCommonQueryableList(Dictionary<string, string> queryParameters);
        IQueryable<Db.Ad.Advertisements> EnforceStartIndexAndCount(Dictionary<string, string> queryParameters,IQueryable<Db.Ad.Advertisements> list);
        AdvertisementCommon GetAdvertisementCommonFromDatabaseResult(Db.Ad.Advertisements advertisement);
        Db.Ad.Advertisements GetAdvertisementsFromUserInputDictionary(Dictionary<string, string> userInputDictionary);
        Task IncrementNumberOfVisit(Guid adGuid);
        Db.Ad.Advertisements GetAdvertisement(AdvertisementCommon advertisementCommon);
    }
}
