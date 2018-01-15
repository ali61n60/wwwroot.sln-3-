using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ModelStd.IRepository
{
    public interface IAdRepository
    {
        IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters);
        Task Add(Dictionary<string, string> userInputDictionary, string userId);
        AdvertisementBase GetAdDetail(Guid adGuid);
    }
}
