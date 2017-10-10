using System;
using System.Globalization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Security;
using Model;
using Repository;
using Repository.Messages;
using WcfService.IOC;
using WcfService.Messages;
using CommonServices;


namespace WcfService.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RegistrationService : IRegistrationService
    {
        private string emailFormatErrorMessage = "فرمت ایمیل وارد شده صحیح نیست";
        private string phoneNumberFormatErrorMessage = "فرمت شماره تلفن وارد شده صحیح نمیباشد. شماره تلفن به صورت یک عدد 11 رقمی میباشد";

        public ResponseBase ValidateUser(string username, string password)
        {
            string errorCode = "RegistrationService.ValidateUser";
            ResponseBase response = new ResponseBase();
            MembershipUser user = Membership.GetUser(); //HttpContext.Current.User.Identity.IsAuthenticated;
            if (user != null)//accessed from browser
            {
                response.SetSuccessResponse();
            }
            else if (Membership.ValidateUser(username, password))//accessed from mobile app
            {
                response.SetSuccessResponse();
            }
            else
            {
                response.SetFailureResponse("خطا در ورود اطلاعات، نام کاربری و یا رمز ورود اشتباه است",errorCode);
            }
            return response;
        }

        public ResponseBase CreateNewUser(string emailAddress, string password, string phonenumber)
        {
            string errorCode = "RegistrationService.CreateNewUser";
            ResponseBase response = new ResponseBase();
            MembershipUser membershipUser;
            if (!IsEmailAddressInCorrectFormat(emailAddress))
            {
                response.SetFailureResponse(emailFormatErrorMessage,errorCode);
                return response;
            }
            if (!IsPhoneNumberInCorrectFormat(phonenumber))
            {
                response.SetFailureResponse(phoneNumberFormatErrorMessage, errorCode);
                return response;
            }
            try
            {
                membershipUser = Membership.GetUser(emailAddress);
                if (membershipUser != null)
                {
                    response.SetFailureResponse("ایمیل وارد شده قبلا ثبت نام شده است", errorCode);
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
                return response;
            }


            try
            {
                //TODO add user to asp_membership
                //TODO add user to custom tables in database
                //TODO use transactios
                try
                {
                    membershipUser = Membership.CreateUser(emailAddress,password, emailAddress);
                }
                catch (Exception ex)
                {
                    response.SetFailureResponse(ex.Message,errorCode);
                    return response;
                }
               
                membershipUser.IsApproved = true;
                if (membershipUser.ProviderUserKey != null)
                {
                    RegistrationRepository registrationRepository = Bootstrapper.container.GetInstance<RegistrationRepository>();
                    Random random = new Random();
                    string emailVeificationCode = random.Next(10000, 100000).ToString();
                    string phoneVerifivationCode = random.Next(10000, 100000).ToString();
                    RepositoryResponse repositoryResponse = registrationRepository.AddExtraInformationIntoAspnet_Users(
                                                            (Guid)membershipUser.ProviderUserKey, emailAddress,
                                                            phonenumber, emailVeificationCode, phoneVerifivationCode);
                    if (!repositoryResponse.Success)
                    {
                        //TODO rollback and show error
                    }

                }
                else
                {
                    //TODO rollback and show error
                }

                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message);
            }
            return response;
        }

        public ResponseBase ForgotPassword(string username)
        {
            
            IEmail email = Bootstrapper.container.GetInstance<IEmail>();
            string errorCode = "RegistrationService.ForgotPassword";
            ResponseBase response = new ResponseBase();
            RepositoryResponse repositoryResponse;
            RegistrationRepository registrationRepository = Bootstrapper.container.GetInstance<RegistrationRepository>();
                

            if (!IsEmailAddressInCorrectFormat(username))
            {
                response.SetFailureResponse(emailFormatErrorMessage, errorCode);
                return response;
            }

            repositoryResponse = registrationRepository.GetCustomerInfromation(username);
            if (!repositoryResponse.Success)
            {
                response.SetFailureResponse(repositoryResponse.Message, errorCode);
                return response;
            }


            //string password = repositoryResponse.Customer.Password;

            StringBuilder messaBuilder=new StringBuilder();

            messaBuilder.AppendLine("<h1><bdi>با سلام</bdi></h1>");
            messaBuilder.AppendLine("<h1><bdi>کاربر گرامی</bdi></h1>");
            messaBuilder.AppendLine("<h1>"+username+"</h1>");
            messaBuilder.AppendLine("<h1><bdi>کلمه عبور شما عبارت زیر می باشد </bdi></h1>");
            //messaBuilder.AppendFormat("<h1 dir=\"ltr\">"+password+"</h1>");
            messaBuilder.AppendLine();
            messaBuilder.AppendLine("<h1><bdi>با تشکر از استفاده شما از سایت</bdi></h1>");
           
            string message = messaBuilder.ToString();
            try
            {
                email.SendEmail(username, message, "پاسخ به درخواست کلمه عبور");
                response.SetSuccessResponse("کلمه عبور به ایمیل شما ارسال شد");
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }
            return response;
        }

        public ResponseBase IsEmailAddressVerified()
        {
            throw new NotImplementedException();
        }

        public ResponseBase IsPhoneNumberVerified()
        {
            throw new NotImplementedException();
        }

        public ResponseBase<Customer> GetUserInfromation()
        {
            RegistrationRepository registrationRepository = Bootstrapper.container.GetInstance<RegistrationRepository>();
            ResponseBase<Customer> response = new ResponseBase<Customer>();
            MembershipUser membershipUser = Membership.GetUser();

            if (membershipUser != null && membershipUser.ProviderUserKey != null)
            {
                RepositoryResponse repositoryResponse =
                    registrationRepository.GetCustomerInfromation((Guid)membershipUser.ProviderUserKey);
                if (repositoryResponse.Success)
                {
                    response.Success = true;
                    response.Message = "OK";
                   // response.ResponseData = repositoryResponse.Customer;
                }
                else
                {
                    response.Success = false;
                    response.Message = repositoryResponse.Message;
                    response.ResponseData = null;
                }
            }
            else
            {
                //TODO get username and password from Request and validate it and then get info from database
                response.Success = false;
                response.Message = "Not Implemented Yet";
                response.ResponseData = null;
            }

            return response;
        }


        bool invalid ;
        public bool IsEmailAddressInCorrectFormat(string username)
        {
            invalid = false;
            if (String.IsNullOrEmpty(username))
                return false;

            // Use IdnMapping class to convert Unicode domain names.
            username = Regex.Replace(username, @"(@)(.+)$", DomainMapper);
            if (invalid)
                return false;

            // Return true if strIn is in valid e-mail format.
            return Regex.IsMatch(username,
                   @"^(?("")(""[^""]+?""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                   @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9]{2,17}))$",
                   RegexOptions.IgnoreCase);
        }
        private string DomainMapper(Match match)
        {
            // IdnMapping class with default property values.
            IdnMapping idn = new IdnMapping();

            string domainName = match.Groups[2].Value;
            try
            {
                domainName = idn.GetAscii(domainName);
            }
            catch (ArgumentException)
            {
                invalid = true;
            }
            return match.Groups[1].Value + domainName;
        }

        public bool IsPhoneNumberInCorrectFormat(string phonenumber)
        {
            Regex regex = new Regex(@"^\d{11}$");

            if (phonenumber.Length != 11)
            {
                return false;
            }

            if (!regex.IsMatch(phonenumber))
            {
                return false;
            }

            if (!IsFirst4DigitsValid(phonenumber))
            {
                return false;
            }

            return true;
        }

        private bool IsFirst4DigitsValid(string phonenumber)
        {
            string[] validFirst4Digits = new string[] { "0912", "0933" };
            string first4Digits = phonenumber.Substring(0, 4);
            foreach (string valid4 in validFirst4Digits)
            {
                if (valid4 == first4Digits)
                {
                    return true;
                }
            }

            return false;
        }

        public Guid GetUserId(string userName)
        {
            RegistrationRepository registrationRepository=new RegistrationRepository();
            return registrationRepository.GetUserGuid(userName);
        }
    }
}
