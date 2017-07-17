using System;
using Model;
using WcfService.Messages;
using WcfService.Services;
//

namespace WebUIMain.Registration
{
    public partial class UserInfo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            initialPageContent();
        }
        private void initialPageContent()
        {

            if (Context.User.Identity.IsAuthenticated)
            {
                RegistrationService service=new RegistrationService();
                
                ResponseBase<Customer> response;
                response = service.GetUserInfromation();
              
                    if (response.Success)
                    {
                        LabelEmail.Text = response.ResponseData.EmailAddress;
                        LabelPhoneNumber.Text = response.ResponseData.PhoneNumber;
                        if (response.ResponseData.VerifiedEmailAddress)
                        {
                            LabelEmailVerifid.Text = "تایید شده";
                            PanelRegisterEmailVerificationCode.Visible = false;
                        }
                        else
                        {
                            LabelEmailVerifid.Text = "تایید نشده";
                            PanelRegisterEmailVerificationCode.Visible = true;
                        }

                        if (response.ResponseData.VerifiedPhoneNumber)
                        {
                            LabelPhoneNumberVerified.Text = "تایید شده";
                            PanelRegisterPhoneNumberVerificationCode.Visible = false;
                        }
                        else
                        {
                            LabelPhoneNumberVerified.Text = "تایید نشده";
                            PanelRegisterPhoneNumberVerificationCode.Visible = true;
                        }


                        LabelEmailVerifid.Text = response.ResponseData.VerifiedEmailAddress ? "تایید شده" : "تایید نشده";
                        LabelPhoneNumberVerified.Text = response.ResponseData.VerifiedPhoneNumber ? "تایید شده" : "تایید نشده";
                    }
                    else
                    {
                        //TODO show erro message on the page
                    }
                }
            else
            {
                //TODO show erro message on the page
            }
        }
    }
}