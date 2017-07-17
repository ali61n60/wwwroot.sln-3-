using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Web;
using System.Web.Security;
using Model.ServiceLibrary;
using Repository;
using Repository.Messages;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SmsService : ISmsService
    {
        public ResponseBase<SmsMessage> GetMessageToSms(string encryptedUsername, string encryptedPassword)
        {
            string errorCode = "SmsService.GetMessageToSms";
            string username = CryptoService.Decrypt(encryptedUsername);
            string password = CryptoService.Decrypt(encryptedPassword);
            ResponseBase<SmsMessage> response = new ResponseBase<SmsMessage>();
            if (!isUsrePassValid(username, password))
            {
                response.SetFailureResponse("Invalid username Or password Or username is not an ADMIN", errorCode);
                return response;
            }
           
            SmsRepository smsRepository = new SmsRepository();
            try
            {
                SmsMessage smsMessage = smsRepository.GetSmsMessageFromDatabase();
                if (smsMessage != null)
                {
                    response.ResponseData = smsMessage;
                    response.SetSuccessResponse();
                }
                else
                {
                    response.SetFailureResponse("No Message To Send",errorCode);
                }
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }
            return response;
        }


        public ResponseBase SetMessageStatusAsSent(SmsMessage smsMessage, string encryptedUsername, string encryptedPassword)
        {
            string errorCode = "SmsService.SetMessageStatusAsSent";
            ResponseBase response = new ResponseBase();
            string username = CryptoService.Decrypt(encryptedUsername);
            string password = CryptoService.Decrypt(encryptedPassword);
            if (!isUsrePassValid(username,password))
            {
                response.SetFailureResponse("Invalid username Or password Or username is not an ADMIN",errorCode);
                return response;
            }
           
            SmsRepository smsRepository = new SmsRepository();
            RepositoryResponseBase repositoryResponse = smsRepository.SetSmsMessageAsSent(smsMessage);
            if (repositoryResponse.Success)
            {
                response.SetSuccessResponse("OK");
            }
            else
            {
                response.SetFailureResponse(repositoryResponse.Message,errorCode);
            }
            return response;
        }

        public ResponseBase PlaceNewMessageInDatabase(string message, string phoneNumber, string encryptedUsername,
            string encryptedPassword)
        {
            string errorCode = "SmsService.PlaceNewMessageInDatabase";
            ResponseBase response = new ResponseBase();
            string username = CryptoService.Decrypt(encryptedUsername);
            string password = CryptoService.Decrypt(encryptedPassword);


            if (!isUsrePassValid(username, password))
            {
                response.SetFailureResponse("Invalid username Or password Or username is not an ADMIN", errorCode);
                return response;
            }
            response = InsertNewMessageInDatabase(message, phoneNumber);

            return response;
        }

        public ResponseBase PlaceNewMessageInDatabase(string message, string phoneNumber)
        {
            string errorCode = "SmsService.PlaceNewMessageInDatabase";
            ResponseBase response = new ResponseBase();
            if (!HttpContext.Current.User.IsInRole("admin1"))
            {
                response.SetFailureResponse("username is not an ADMIN",errorCode);
                return response;
            }
            response = InsertNewMessageInDatabase(message, phoneNumber);

            return response;
        }


        private ResponseBase InsertNewMessageInDatabase(string message, string phoneNumber)
        {
            string errorCode = "SmsService.InsertNewMessageInDatabase";
            ResponseBase response = new ResponseBase();
            SmsRepository smsRepository = new SmsRepository();
            RepositoryResponseBase repositoryResponse = smsRepository.PlaceNewSmsForSend(message, phoneNumber);
            if (repositoryResponse.Success)
            {
                response.SetSuccessResponse("OK");
            }
            else
            {
                errorCode += "===>>>"+repositoryResponse.ErrorCode;
                response.SetFailureResponse(repositoryResponse.Message, errorCode);
            }
            return response;
        }

        private bool isUsrePassValid(string username, string password)
        {
            bool isUserValid;
            isUserValid = Membership.ValidateUser(username, password);
            if (!isUserValid)
            {
                return isUserValid;
            }
            isUserValid = Roles.IsUserInRole(username, "admin1");
            return isUserValid;
        }

       
    }
}
