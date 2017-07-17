using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using Model;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceContract]
    public interface IRegistrationService
    {
        [OperationContract]
        ResponseBase ValidateUser(string username, string password);
        [OperationContract]
        ResponseBase CreateNewUser(string emailAddress, string password, string phonenumber);
        [OperationContract]
        ResponseBase ForgotPassword(string username);
        [OperationContract]
        ResponseBase IsEmailAddressVerified();
        [OperationContract]
        ResponseBase IsPhoneNumberVerified();
        [OperationContract]
        ResponseBase<Customer> GetUserInfromation();
    }
}
