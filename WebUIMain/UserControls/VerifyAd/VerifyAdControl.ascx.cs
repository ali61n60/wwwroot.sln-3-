using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Model.Advertisements;
using Repository;
using WcfService.Messages;
using WcfService.Services;
using WebUIMain.Advertisement;
using WebUIMain.Manager.ManageAdvertisements;


namespace WebUIMain.UserControls.VerifyAd
{
    public partial class VerifyAdControl : System.Web.UI.UserControl
    {
        private AdvertisementCommon _advertisementCommon;

        public void SetAdvertisementCommon(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
        }

        public VerifyAdControl(AdvertisementCommon advertisementCommon)
        {
            _advertisementCommon = advertisementCommon;
        }
        public VerifyAdControl()
        {
            
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
                // LabelPrice.Text = _advertisementCommon.AdvertisementPrice.price.ToString("N0") + " ," + _advertisementCommon.AdvertisementPrice.GetStringPriceType();
                LabelAdStatus.Text = _advertisementCommon.AdvertisementStatus;
                //  adDetail.NavigateUrl = "~/Search/AdDetail/AdDetail.aspx?adId=" + _advertisementCommon.AdvertisementId.ToString() +
                //     "&categoryId=" + _advertisementCommon.AdvertisementCategoryId.ToString();
                LabelAdTitle.Text = _advertisementCommon.AdvertisementTitle;
                LabelCategory.Text = _advertisementCommon.AdvertisementCategory;
                //   HyperLinkEdit.NavigateUrl = adAttributes.AdvertisementUrl;
              
            }
        }

        protected void ButtonViewDetail_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Search/AdDetail/AdDetail.aspx?adId=" + _advertisementCommon.AdvertisementId.ToString() +
                   "&categoryId=" + _advertisementCommon.AdvertisementCategoryId.ToString(),true);
        }

        protected void ButtonDelete_Click(object sender, EventArgs e)
        {
            
            AdvertisementCommonService service = new AdvertisementCommonService();
            ResponseBase response = service.RemoveAdvertisement(_advertisementCommon);

            if (response.Success)
            {
                Response.Redirect("~/Manager/ManageAdvertisements/VerifyAdvertisements.aspx" + "?message=" + " " + "آگهی پاک شد");
            }
            else
            {
                Response.Redirect("~/Manager/ManageAdvertisements/VerifyAdvertisements.aspx" + "?message=" + " " + "خطا");
            }
        
        }

        protected void ButtonVerify_Click(object sender, EventArgs e)
        {
            //TODO connect to database and set adId to textbox
            int adStatusId = int.Parse(TextBoxAdStatusId.Text);

            int rowsAffected;
            SqlConnection connection = new SqlConnection(AdvertisementDataClass.GetConnectionString());
            //TODO use stored procedure
            SqlCommand command = new SqlCommand("UPDATE Advertisements SET" +
            " adStatusId=@adStatusId " +
            " WHERE adId=@adId ",
                connection);
            //insert input parameters
            command.Parameters.Add("@adId", System.Data.SqlDbType.UniqueIdentifier).Value = _advertisementCommon.AdvertisementId;
            command.Parameters.Add("@adStatusId", System.Data.SqlDbType.Int).Value = adStatusId;
            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();
                LabelMessage.Text = "تغییر وضعیت انجام شد";
                this.Parent.Controls.Remove(this);
                
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
            }
            if (rowsAffected <= 0)
            {
                LabelMessage.Text = "خطا در تغییر وضعیت";
            }
           
        }

       

     

      
        
    }
}