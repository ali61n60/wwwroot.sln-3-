using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Manager.ManageAdvertisements
{
    public partial class SetSmsMessages : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ButtonInsertNewMessage_Click(object sender, EventArgs e)
        {
            SmsService smsService=new SmsService();
            ResponseBase smsResponse= smsService.PlaceNewMessageInDatabase(TextBoxMessage.Text, TextBoxPhoneNumber.Text);
            LabelResult.Text = "Success:"+smsResponse.Success + "  ,"+smsResponse.Message;
        }
    }
}