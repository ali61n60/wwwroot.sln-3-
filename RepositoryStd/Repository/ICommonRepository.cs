using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using RepositoryStd.Context.AD;
using RepositoryStd.Context.Identity;

namespace RepositoryStd.Repository
{
    public interface ICommonRepository
    {
        IQueryable<Advertisements> GetQueryableList(Dictionary<string, string> queryParameters,AdDbContext adDbContext);

        AdvertisementCommon GetAdvertisementCommonFromDatabaseResult(Advertisements advertisement,AppIdentityDbContext identityDbContext);

        Task IncrementNumberOfVisit(Guid adGuid);
        Advertisements GetAdvertisement(AdvertisementCommon advertisementCommon);
    }
}
