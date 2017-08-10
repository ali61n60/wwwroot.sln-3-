using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;

namespace ModelStd.Advertisements
{
    
    public class AdvertisementBase
    {
        
        public AdvertisementCommon AdvertisementCommon { get; set; }

        public AdvertisementBase()
        {
            AdvertisementCommon=new AdvertisementCommon();
        }

        AdvertisementCommon[] GetAdvertisementCommons(AdvertisementBase[] advertisementBases)
        {
            List<AdvertisementCommon> returnAdvertisementCommons = new List<AdvertisementCommon>();
            foreach (AdvertisementBase baseAd in advertisementBases)
            {
                returnAdvertisementCommons.Add(baseAd.AdvertisementCommon);
            }
            return returnAdvertisementCommons.ToArray();
        }
    }
}
