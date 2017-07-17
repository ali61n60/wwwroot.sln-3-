using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using Model.ServiceLibrary;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceContract]
    public interface ISmsService
    {
        [OperationContract]
        ResponseBase<SmsMessage> GetMessageToSms(string encryptedUsername, string encryptedPassword);

        [OperationContract]
        ResponseBase SetMessageStatusAsSent(SmsMessage smsMessage, string encryptedUsername, string encryptedPassword);

        ResponseBase PlaceNewMessageInDatabase(string message, string phoneNumber, string encryptedUsername,
            string encryptedPassword);
    }
}
