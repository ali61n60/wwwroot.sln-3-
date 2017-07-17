using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.Security;
using System.Threading;
using System.Globalization;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Registration
{
    public partial class Login : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ButtonLogin_Click(object sender, EventArgs e)
        {
            ResponseBase response;
            RegistrationService service=new RegistrationService();
            string emailAddress = TextBoxEmail.Text;
            string password = TextBoxPassword.Text;
            response = service.ValidateUser(emailAddress,password);
            if (response.Success)
            {
                FormsAuthentication.RedirectFromLoginPage(emailAddress, CheckBoxRememberMe.Checked);
            }
            else
            {
                LabelMessage.Text = response.Message;
            }
        }

        protected void ButtonForgottenPassword_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Registration/ForgottenPassword.aspx", true);
        }

        protected void ButtonCreateNewUserPage_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Registration/CreateNewUser.aspx", true);
        }

    }
}





    