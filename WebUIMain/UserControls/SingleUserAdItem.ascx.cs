using System;
using Model.Advertisements;
using WcfService.Messages;
using WcfService.Services;
using WebUIMain.Advertisement;
using System.Web.UI;



namespace WebUIMain.UserControls
{
    public partial class SingleUserAdItem : UserControl
    {
        private AdvertisementCommon _advertisementCommon;

        public void SetAdvertisementCommon(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
        }

        public SingleUserAdItem()
        {

        }

        public SingleUserAdItem(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (_advertisementCommon != null)
            {
                if (_advertisementCommon.AdvertisementImages != null &&
                    _advertisementCommon.AdvertisementImages.Length > 0)
                {
                    Image1.ImageUrl = "data:image/jpg;base64," + _advertisementCommon.AdvertisementImages[0];
                }
                LabelAdTime.Text = _advertisementCommon.AdvertisementTime.ToShortDateString();
                LabelAdStatus.Text = _advertisementCommon.AdvertisementStatus;
                LabelAdTitle.Text = _advertisementCommon.AdvertisementTitle;
                LabelCategory.Text = _advertisementCommon.AdvertisementCategory;
            }
        }

        protected void ButtonDelete_Click(object sender, EventArgs e)
        {
            AdvertisementCommonService service = new AdvertisementCommonService();
            ResponseBase response = service.RemoveAdvertisement(_advertisementCommon);

            if (response.Success)
            {
                Response.Redirect("~/Advertisement/UserAdvertisements.aspx" + "?message=" + " " + "آگهی پاک شد");
            }
            else
            {
                ((UserAdvertisements)Page).LabelMessage.Text = response.Message;
            }
        }

        protected void ButtonExtension_Click(object sender, EventArgs e)
        {
            AdvertisementCommonService service = new AdvertisementCommonService();
            ResponseBase response = service.ExtendAdvertisement(_advertisementCommon);
            if (response.Success)
            {
                Response.Redirect("~/Advertisement/UserAdvertisements.aspx" + "?message=" + " " + "آگهی تمدید شد");
            }
            else
            {
                ((UserAdvertisements)Page).LabelMessage.Text = response.Message;
            }
        }

        protected void ButtonViewDetail_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Search/AdDetail/AdDetail.aspx?adId=" + _advertisementCommon.AdvertisementId +
                    "&categoryId=" + _advertisementCommon.AdvertisementCategoryId);
        }

        protected void ButtonEditAd_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Advertisement/EditAdvertisement.aspx?adId=" + _advertisementCommon.AdvertisementId +
                    "&categoryId=" + _advertisementCommon.AdvertisementCategoryId);
        }
    }
}
