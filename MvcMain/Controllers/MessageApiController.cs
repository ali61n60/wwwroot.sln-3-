using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Db.Ad;
using ModelStd.Services;
using RepositoryStd.Context.AD;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admins")]
    public class MessageApiController:Controller
    {
        private AdDbContext _adDbContext;

        public MessageApiController(AdDbContext adDbContext)
        {
            _adDbContext = adDbContext;
        }

        public ResponseBase InsertSmsMessageInDataBase(Message message)
        {
            throw new NotImplementedException();
            string errorCode = "MessageApiController/InsertSmsMessageInDataBase";
            ResponseBase response=new ResponseBase();
            try
            {
                
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }


            return response;
        }

        public ResponseBase<List<SmsMessage>> GetUnSentSmsMesseges()
        {
            string errorCode = "MessageApiController/GetUnSentSmsMesseges";
            ResponseBase<List<SmsMessage>> response=new ResponseBase<List<SmsMessage>>();
            try
            {
                List<Message> smsMessages = _adDbContext.Messages
                    .Include(message => message.User)
                    .Where(message => message.Sent == false && message.EmailOrSms != EmailOrSms.Email)
                    .OrderBy(message => message.Priority)
                    .ThenBy(message => message.MessageDate).ToList();
                response.ResponseData = new List<SmsMessage>(smsMessages.Count);
                foreach (Message message in smsMessages)
                {
                    response.ResponseData.Add(convertMessageToSmsMessage(message));
                }
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }
            
            return response;
        }

        
        public ResponseBase SetSmsMessageStatusAsSent(int messageId)
        {
            string errorCode = "MessageApiController/SetSmsMessageStatusAsSent";
            throw new NotImplementedException();
        }

        public ResponseBase InsertEmailMessageInDataBase(EmailMessage emailMessage)
        {
            string errorCode = "MessageApiController/InsertEmailMessageInDataBase";
            throw new NotImplementedException();
        }

        public ResponseBase<List<EmailMessage>> GetUnSentEmailMesseges()
        {
            string errorCode = "MessageApiController/GetUnSentEmailMesseges";
            throw new NotImplementedException();
        }

        public ResponseBase SetEmailMessageStatusAsSent(int messageId)
        {
            string errorCode = "MessageApiController/SetEmailMessageStatusAsSent";
            throw new NotImplementedException();
        }

        private SmsMessage convertMessageToSmsMessage(Message message)
        {
            SmsMessage tempSmsMessage = new SmsMessage();
            tempSmsMessage.PhoneNumber = message.User.PhoneNumber;
            tempSmsMessage.TextMessage = message.TextMessage;
            tempSmsMessage.MessageId = message.MessageId;

            return tempSmsMessage;
        }
    }
}
