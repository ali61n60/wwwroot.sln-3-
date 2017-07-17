using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
//
using System.Web.Security;
using System.Threading;
using System.Globalization;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Registration
{
    public partial class CreateNewUser : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //TODO create new user
        }
        protected void ButtonCreateNewUser_Click(object sender, EventArgs e)
        {
            
            ResponseBase response;
            RegistrationService service = new RegistrationService();
            string EmailAddress = TextBoxEmail.Text;
            string Password = TextBoxPassword.Text;
            string passwordRepeat = TextBoxPasswordRepeat.Text;
            string PhoneNumber = TextBoxMobilePhoneNumber.Text;
            
            //TODO also do it in javaScript on client or use validator
            if (Password != passwordRepeat)
            {
                LabelMessage.Text = "فیلد رمز ورود با فیلد تکرار رمز ورود برابر نیست";
                return;
            }
            response = service.CreateNewUser(EmailAddress, Password, PhoneNumber);
            if (response.Success)
            {
                FormsAuthentication.SetAuthCookie(EmailAddress, true);
                string welcomeMessage = EmailAddress + " , خوش آمدید";
                Response.Redirect("~/Advertisement/Advertisement.aspx?message="+welcomeMessage, true);
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
            Response.Redirect("~/Registration/Login.aspx", true);
        }
    }
}
