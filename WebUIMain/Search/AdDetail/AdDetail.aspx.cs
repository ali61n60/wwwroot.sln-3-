using System;

namespace WebUIMain.Search.AdDetail
{
    public partial class AdDetail : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Guid adId = Guid.NewGuid();
            int categoryId = 0;
            if (Request.QueryString["adId"] == null || Request.QueryString["categoryId"]==null)
            {
                Response.Redirect("../urlError.aspx?message=" + "خطا در فرمت ورودی", true);
            }
            else
            {
                try
                {
                    adId = Guid.Parse(Request.QueryString["adId"]);
                    categoryId = int.Parse(Request.QueryString["categoryId"]);
                }
                catch (Exception ex)
                {
                    Response.Redirect("urlError.aspx?message=" + "خطا در فرمت ورودی. آگهی درخواستی وجود ندارد", true);
                }
            }
            AdDetailCommonControl.FillAttributesFromServiceLayer(adId,categoryId);
        }   
    }
}


  

