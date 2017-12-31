using System.Collections.Generic;
using ModelStd.Advertisements;

namespace ModelStd.IRepository
{
    public interface IFindRepository
    {
        IEnumerable<AdvertisementCommon> FindAdvertisementCommons(Dictionary<string, string> queryParameters);
    }
}
