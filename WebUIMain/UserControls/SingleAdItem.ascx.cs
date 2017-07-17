using System;
using Model.Advertisements;
using System.Web.UI;

namespace WebUIMain.UserControls
{
    public partial class SingleAdItem : UserControl
    {
        private AdvertisementCommon advertisementCommon;

        public void SetAdvertisementCommon(AdvertisementCommon advertisementCommon)
        {
            this.advertisementCommon = advertisementCommon;
        }

        public SingleAdItem()
        {
            
        }

        public SingleAdItem(AdvertisementCommon advertisementCommon)
        {
            this.advertisementCommon = advertisementCommon;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (advertisementCommon != null)
            {
                if (advertisementCommon.AdvertisementImages != null &&
                    advertisementCommon.AdvertisementImages.Length > 0)
                {
                    Image1.ImageUrl = "data:image/jpg;base64," + advertisementCommon.AdvertisementImages[0];
                }
                LabelDate.Text = advertisementCommon.AdvertisementTime.ToShortDateString();
                LabelPrice.Text = advertisementCommon.AdvertisementPrice.price.ToString("N0")+" ,"+advertisementCommon.AdvertisementPrice.GetStringPriceType();
                LabelAdStatus.Text = advertisementCommon.AdvertisementStatus;
                adDetail.NavigateUrl = "~/Search/AdDetail/AdDetail.aspx?adId=" + advertisementCommon.AdvertisementId.ToString()+
                    "&categoryId="+advertisementCommon.AdvertisementCategoryId.ToString();
                LabelAdTitle.Text = advertisementCommon.AdvertisementTitle;
                LabelCategory.Text = advertisementCommon.AdvertisementCategory;
            }
        }

        
    }
}