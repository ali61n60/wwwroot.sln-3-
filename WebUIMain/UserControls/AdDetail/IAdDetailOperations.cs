using System;
using Model.Advertisements;

namespace WebUIMain.UserControls.AdDetail
{
    public interface IAdDetailOperations
    {
        ResponseBase FillAdvertisementAttributesFromService(Guid advertisementId);

        AdvertisementCommon GetAdvertisementCommon();
        
    }
}