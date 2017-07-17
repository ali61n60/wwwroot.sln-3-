using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Model.Advertisements;
using WcfService.Messages;

namespace WebUIMain.UserControls.AdDetail
{
    public interface IAdDetailOperations
    {
        ResponseBase FillAdvertisementAttributesFromService(Guid advertisementId);

        AdvertisementCommon GetAdvertisementCommon();
        
    }
}