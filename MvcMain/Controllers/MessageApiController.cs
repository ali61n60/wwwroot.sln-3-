using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Services;
using RepositoryStd.Context.AD;
using SmsMessage = ModelStd.Db.Ad.SmsMessage;

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

        public ResponseBase InsertSmsMessageInDataBase(SmsMessage smsMessage)
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

        public ResponseBase<List<ModelStd.SmsMessageSingle>> GetUnSentSmsMesseges()
        {
            string errorCode = "MessageApiController/GetUnSentSmsMesseges";
            ResponseBase<List<SmsMessageSingle>> response=new ResponseBase<List<SmsMessageSingle>>();
            try
            {
                List<SmsMessage> smsMessages = _adDbContext.SmsMessages
                    .Include(message => message.User)
                    .Where(message => message.Sent == false)
                    .OrderBy(message => message.Priority)
                    .ThenBy(message => message.MessageDate).ToList();
                response.ResponseData = new List<SmsMessageSingle>(smsMessages.Count);
                foreach (SmsMessage message in smsMessages)
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

        public ResponseBase InsertEmailMessageInDataBase(EmailMessageSingle emailMessageSingle)
        {
            string errorCode = "MessageApiController/InsertEmailMessageInDataBase";
            throw new NotImplementedException();
        }

        public ResponseBase<List<EmailMessageSingle>> GetUnSentEmailMesseges()
        {
            string errorCode = "MessageApiController/GetUnSentEmailMesseges";
            throw new NotImplementedException();
        }

        public ResponseBase SetEmailMessageStatusAsSent(int messageId)
        {
            string errorCode = "MessageApiController/SetEmailMessageStatusAsSent";
            throw new NotImplementedException();
        }

        private ModelStd.SmsMessageSingle convertMessageToSmsMessage(SmsMessage smsMessage)
        {
            ModelStd.SmsMessageSingle tempSmsMessageSingle = new ModelStd.SmsMessageSingle();
            tempSmsMessageSingle.PhoneNumber = smsMessage.User.PhoneNumber;
            tempSmsMessageSingle.TextMessage = smsMessage.TextMessage;
            tempSmsMessageSingle.MessageId = smsMessage.MessageId;

            return tempSmsMessageSingle;
        }
    }
}
