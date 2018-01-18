using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModelStd;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.Services;
using MvcMain.Infrastructure;
using RepositoryStd.Context.AD;
using SmsMessage = ModelStd.Db.Ad.SmsMessage;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admins")]
    public class MessageApiController : Controller
    {
        private AdDbContext _adDbContext;
        private UserManager<AppUser> _userManager;
        private ILogger _logger;

        public MessageApiController(AdDbContext adDbContext, UserManager<AppUser> userManager, ILogger logger)
        {
            _adDbContext = adDbContext;
            _userManager = userManager;
            _logger = logger;
        }

        public ResponseBase InsertSmsMessageInDataBase(SmsMessage smsMessage)
        {
            throw new NotImplementedException();
            string errorCode = "MessageApiController/InsertSmsMessageInDataBase";
            ResponseBase response = new ResponseBase();
            try
            {

            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }


            return response;
        }

        public ResponseBase<List<ModelStd.SmsMessageSingle>> GetUnSentSmsMesseges()
        {
            string errorCode = "MessageApiController/GetUnSentSmsMesseges";
            ResponseBase<List<SmsMessageSingle>> response = new ResponseBase<List<SmsMessageSingle>>();
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
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
        }


        public ResponseBase SetSmsMessageStatusAsSent(int messageId)
        {
            string errorCode = "MessageApiController/SetSmsMessageStatusAsSent";
            throw new NotImplementedException();
        }

        public async Task<ResponseBase> InsertEmailMessageInDataBase(
            EmailMessageSingle emailMessageSingle,
            string userId = "",
            MessagePriority messagePriority = MessagePriority.Low)
        {
            string errorCode = "MessageApiController/InsertEmailMessageInDataBase";
            ResponseBase response = new ResponseBase();
            EmailMessage emailMessage = new EmailMessage();
            if (userId != "")
            {
                AppUser user = await _userManager.FindByEmailAsync(emailMessageSingle.EmailAddress);
                if (user == null)
                {
                    response.SetFailureResponse("EmailAddress does not exists in our database");
                    return response;
                }
                emailMessage.UserId = user.Id;
            }
            else
            {
                emailMessage.UserId = userId;
            }
            emailMessage.MessageDate = DateTime.Now;
            emailMessage.Priority = messagePriority;
            emailMessage.Sent = false;
            emailMessage.Subject = emailMessageSingle.Subject;
            emailMessage.TitleMessage = emailMessageSingle.Title;
            emailMessage.TextMessage = emailMessageSingle.TextMessage;
            try
            {
                _adDbContext.EmailMessages.Add(emailMessage);
                await _adDbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
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

        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        protected readonly int ExecutionLoopDelayMs = 0;
        private Task TheNeverEndingTask;
        public void SendEmailsFromDatabase()
        {
            TheNeverEndingTask = new Task(async
            () =>
            {
                // Wait to see if we get cancelled...
                while (!_cts.Token.WaitHandle.WaitOne(ExecutionLoopDelayMs))
                {
                    // Otherwise execute our code...
                    await _logger.LogError("SendEmailsFromDatabase " + DateTime.Now);
                    await Task.Delay(1000);

                    //TODO get email from databse and send it 
                    // set sent in the database for email
                    //get next email and do it again
                }
                _cts.Token.ThrowIfCancellationRequested();
            },
            _cts.Token,
            TaskCreationOptions.DenyChildAttach | TaskCreationOptions.LongRunning);
            // Do not forget to observe faulted tasks - for NeverEndingTask faults are probably never desirable
            TheNeverEndingTask.ContinueWith(x =>
            {
                string kk = "";
                // Log/Fire Events etc.
            }, TaskContinuationOptions.OnlyOnFaulted);

            TheNeverEndingTask.Start();

        }

        public void StopSendEmailsFromDatabase()
        {
            // This code should be reentrant...
            _cts.Cancel();
            TheNeverEndingTask.Wait();
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
