using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Registration
{
    public partial class ForgottenPassword : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ButtonForgetPassword_Click(object sender, EventArgs e)
        {
            string username = TextBoxEmail.Text;
            ResponseBase response;
            RegistrationService service = new RegistrationService();
           
            response = service.ForgotPassword(username);
            LabelMessage.Text = response.Message;
        }
        protected void ButtonLogin_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Registration/Login.aspx", true);
        }
        protected void ButtonCreateNewUserPage_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Registration/CreateNewUser.aspx", true);
        }
    }
}