using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
//
using System.Data.SqlClient;
using Model.IRepository;
using Model;
using Model.Advertisements;
using WebUIMain.UserControls;
using Model.ServiceLibrary;
using Repository;
using WcfService.IOC;
using WcfService.Messages;
using WcfService.Services;


namespace WebUIMain.Advertisement
{
    public partial class UserAdvertisements : System.Web.UI.Page
    {
        /// <summary>
        /// LabelMessage control.
        /// </summary>
        /// <remarks>
        /// Auto-generated field.
        /// To modify move field declaration from designer file to code-behind file.
        /// </remarks>
        public global::System.Web.UI.WebControls.Label LabelMessage;
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["message"] != null)
            {
                LabelMessage.Text = Request.QueryString["message"]+"\n";
            }
            else
            {
                LabelMessage.Text = "";
            }
            ResponseBase<AdvertisementCommon[]> response;
            AdvertisementCommonService service=new AdvertisementCommonService();
            response = service.GetCustomerAdvertisementCommon(Membership.GetUser().UserName,null,false);
            if (response.Success)
            {
                service.FillFirstImage(response.ResponseData);
            }
            
            if (response.Success)
            {
                SingleUserAdItem[] userControl;
                if (response.ResponseData.Length <= 0)
                {
                    LabelMessage.Text += "شما در حال حاظر آگهی ندارید";
                    return;
                }
                else
                {
                    userControl = new SingleUserAdItem[response.ResponseData.Length];
                    for (int i = 0; i < response.ResponseData.Length; i++)
                    {
                        userControl[i] = (SingleUserAdItem) LoadControl("~/UserControls/SingleUserAdItem.ascx");
                        userControl[i].SetAdvertisementCommon(response.ResponseData[i]);
                    }
                    for (int i = 0; i < userControl.Length; i++)
                    {
                        PlaceHolder1.Controls.Add(userControl[i]);
                    }
                }
            }
            else
            {
                LabelMessage.Text = response.Message;
            }
        }
    }

}