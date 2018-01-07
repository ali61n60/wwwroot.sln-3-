using System.Collections.Generic;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ModelStd.IRepository
{
    public interface IAdRepository
    {
        IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters);
        void Add(Dictionary<string, string> queryParameters, string userId);
    }
}
