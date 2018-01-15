using System;
using System.Collections.Generic;
using System.Text;

namespace ModelStd.Advertisements
{
    //TODO watch out for self referencing in AdvertisementCommon
    public class AdvertisementBase
    {
        public AdvertisementCommon AdvertisementCommon { get; set; }
    }
}
