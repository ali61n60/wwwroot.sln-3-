using System.Collections.Generic;
using ModelStd.Advertisements;

namespace ModelStd.IRepository
{
    public interface IFindRepository
    {
        IEnumerable<AdvertisementCommon> FindAdvertisementCommons(IQuery query, int index, int count);
    }
}
