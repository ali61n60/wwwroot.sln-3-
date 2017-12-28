using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd.Advertisements;


namespace ModelStd.IRepository
{
    public interface ICommonRepository
    {
        IQueryable<Db.Ad.Advertisements> GetQueryableList(Dictionary<string, string> queryParameters);

        AdvertisementCommon GetAdvertisementCommonFromDatabaseResult(Db.Ad.Advertisements advertisement);

        Task IncrementNumberOfVisit(Guid adGuid);
        Db.Ad.Advertisements GetAdvertisement(AdvertisementCommon advertisementCommon);
    }
}
