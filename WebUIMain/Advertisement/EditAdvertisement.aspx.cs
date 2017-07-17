using System;
using System.Web.UI;
using WebUIMain.UserControls.NewAd;

namespace WebUIMain.Advertisement
{
    public partial class EditAdvertisement : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["adId"] == null || Request.QueryString["categoryId"] == null)
                Response.Redirect("../urlError.aspx?message=" + "خطا در فرمت ورودی", true);
            else
            {
                try
                {
                    Guid adId = Guid.Parse(Request.QueryString["adId"]);
                    int categoryId = int.Parse(Request.QueryString["categoryId"]);
                    addadDetailControl(categoryId, adId);
                    LabelAdTitle.Text = @"AdId=" + adId + @" , CategoryId=" + categoryId;
                }
                catch (Exception)
                {
                    Response.Redirect("urlError.aspx?message=" + "خطا در فرمت ورودی. آگهی درخواستی وجود ندارد", true);
                }
            }
        }

        private void addadDetailControl(int categoryId, Guid adId)
        {
            CustomNewAdCreator customNewAdCreator=new CustomNewAdCreator();
            INewAdOperations newAdOperations = (INewAdOperations)customNewAdCreator.GetCustomControl(categoryId);
            newAdOperations.GetAdDetailFromRepositoryAndSetFields(adId);
            PlaceHolderAdDetail.Controls.Add(newAdOperations as Control);
        }
    }
}