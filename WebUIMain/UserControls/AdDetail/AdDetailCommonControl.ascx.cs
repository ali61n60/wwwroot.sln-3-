using System;
using System.Web.UI;
using Model.Advertisements;
using WcfService.Messages;


namespace WebUIMain.UserControls.AdDetail
{
    public partial class AdDetailCommonControl : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void FillAttributesFromServiceLayer(Guid advertisementId, int categoryId)
        {
            IAdDetailOperations adDetailOperations;
            CustomAdDetailCreator customAdDetailCreator = new CustomAdDetailCreator();
            Control customControl = customAdDetailCreator.GetCustomControl(categoryId);
            adDetailOperations = (IAdDetailOperations)customControl;
            try
            {
                ResponseBase responseBase = adDetailOperations.FillAdvertisementAttributesFromService(advertisementId);
                if (responseBase.Success && adDetailOperations.GetAdvertisementCommon() != null)
                {
                    fillCommonAttribute(adDetailOperations.GetAdvertisementCommon());
                    fillAdImages(adDetailOperations.GetAdvertisementCommon());
                    PlaceHolderAdCustomControl.Controls.Add(customControl);
                }
                else
                {
                    fillErrorMessageOnTheControl(responseBase.Message);
                }
            }
            catch (Exception ex)
            {
                fillErrorMessageOnTheControl(ex.Message);
            }
           
        }

        private void fillCommonAttribute(AdvertisementCommon advertisementCommon)
        {
            LabelAdTitle.Text = advertisementCommon.AdvertisementTitle;
            LabelComments.Text = advertisementCommon.AdvertisementComments;
            LabelTime.Text = advertisementCommon.AdvertisementTime.ToShortDateString();
            LabelPrice.Text = advertisementCommon.AdvertisementPrice.price.ToString("N1");
            LabelPriceType.Text = advertisementCommon.AdvertisementPrice.GetStringPriceType();
            LabelPhoneNumber.Text = advertisementCommon.PhoneNumber;
            LabelEmail.Text = advertisementCommon.Email;
        }

        private void fillAdImages(AdvertisementCommon advertisementCommon)
        {
            string thumbImage;
            string bigImage;
            string literalString;
            Control tempLiteralControl;
            bool firstImageAdded = false;
            if (advertisementCommon.AdvertisementImages == null)
            {
                return;
            }
            for (int i = 0; i < advertisementCommon.AdvertisementImages.Length; i += 2)
            {
                if (advertisementCommon.AdvertisementImages[i] != null)
                {
                    thumbImage = "data:image/jpg;base64," + advertisementCommon.AdvertisementImages[i];
                    bigImage = "data:image/jpg;base64," + advertisementCommon.AdvertisementImages[i + 1];
                    if (!firstImageAdded)
                    {
                        literalString = "<li class=\"lslide\" data-thumb=\"" + thumbImage + "\" >";
                        firstImageAdded = true;
                    }
                    else
                    {
                        literalString = "<li data-thumb=\"" + thumbImage + "\" >";
                    }
                    literalString += "<img width=\"100%\" height=\"auto\" src=\""+bigImage + "\" />";
                    literalString += "</li>";
                    tempLiteralControl=new LiteralControl(literalString);
                    
                    imageGallery.Controls.Add(tempLiteralControl);
                }
            }
        }

        private void fillErrorMessageOnTheControl(string message)
        {
            LabelAdTitle.Text = message;
        }
    }
}







