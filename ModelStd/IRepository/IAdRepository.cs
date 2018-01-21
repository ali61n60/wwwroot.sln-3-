using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ModelStd.IRepository
{
    //Implemented by all category specific repositories
    public interface IAdRepository
    {
        IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters);
        Task Add(Dictionary<string, string> userInputDictionary, string userId);
        AdvertisementCommon GetAdDetail(Guid adGuid);// each repositor will return a derived object that contains more properties than AdvertisementCommon
        Task AddLetMeKnow(Dictionary<string, string> userInputDictionary, string userId);
    }
}
