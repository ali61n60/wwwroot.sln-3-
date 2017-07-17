using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Model.Advertisements;
using WcfService.Messages;

namespace WebUIMain.UserControls.NewAd
{
    public interface INewAdOperations
    {
        void FillAdvertisementCustomAttributesFromUserInput();

        AdvertisementCommon GetAdvertisementCommon();

        ResponseBase SaveAdvertisement();

        void GetAdDetailFromRepositoryAndSetFields(Guid adId);
    }
}