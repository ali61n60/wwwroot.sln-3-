using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ModelStd;
using ModelStd.Db.Ad;
using ModelStd.Db.Identity;
using ModelStd.Services;
using MvcMain.Infrastructure.Services.Email;
using MvcMain.Infrastructure.Services.Logger;
using RepositoryStd.Context.AD;

namespace MvcMain.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admins")]
    public class MessageApiController : Controller
    {
        private readonly AdDbContext _adDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmail _email;
        private static  ILogger _logger;


        public MessageApiController(AdDbContext adDbContext, UserManager<AppUser> userManager
            , IEmail email, ILogger logger)
        {
            _adDbContext = adDbContext;
            _userManager = userManager;
            _email = email;
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

        public ResponseBase<List<SmsMessageSingle>> GetUnSentSmsMesseges()
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
                    response.ResponseData.Add(convertSmsMessageToSmsMessageSingle(message));
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

        public async Task<ResponseBase> InsertEmailMessageInDataBase(EmailMessageSingle emailMessageSingle,string userId = "",MessagePriority messagePriority = MessagePriority.Low)
        {
            string errorCode = "MessageApiController/InsertEmailMessageInDataBase";
            ResponseBase response = new ResponseBase();
            EmailMessage emailMessage = new EmailMessage();
            if (userId == "")
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
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
        }

        public async Task<ResponseBase<List<EmailMessageSingle>>> GetUnSentEmailMesseges(int maxResponseCount)
        {
            string errorCode = "MessageApiController/GetUnSentEmailMesseges";
            ResponseBase<List<EmailMessageSingle>> response = new ResponseBase<List<EmailMessageSingle>>();
            try
            {
                List<EmailMessage> unSentEmails = await _adDbContext.EmailMessages
                    .Include(message => message.User)
                    .Where(message => message.Sent == false)
                    .OrderBy(message => message.Priority)
                    .ThenBy(message => message.MessageDate).Take(maxResponseCount).ToListAsync();
                List<EmailMessageSingle> emailMessageSingles = new List<EmailMessageSingle>(unSentEmails.Count);
                EmailMessageSingle tempEmailMessageSingle;
                foreach (EmailMessage emailMessage in unSentEmails)
                {
                    tempEmailMessageSingle = convertEmailMessageToEmailMessageSingle(emailMessage);
                    emailMessageSingles.Add(tempEmailMessageSingle);
                }
                response.ResponseData = emailMessageSingles;
                response.SetSuccessResponse();

            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message, errorCode);
            }

            return response;
        }

        public async Task<ResponseBase> SetEmailMessageStatusAsSent(int messageId)
        {
            string errorCode = "MessageApiController/SetEmailMessageStatusAsSent";
            ResponseBase response=new ResponseBase();
            try
            {
                EmailMessage emailMessage=await _adDbContext.EmailMessages.FirstAsync(message => message.MessageId == messageId);
                emailMessage.Sent = true;
                await _adDbContext.SaveChangesAsync();
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }

            return response;
        }

        private static CancellationTokenSource _cts = new CancellationTokenSource();
        protected static readonly int ExecutionLoopDelayMs = 0;
        private static Task TheNeverEndingTask;
        private static void SendEmailsFromDatabase()
        {
            string errorCode = "MessageApiController/SendEmailsFromDatabase";
            try
            {
                //TODO refactor this
                TheNeverEndingTask = new Task(async ()=>
                    {
                        MessageApiController messageApiControllerTask =
                            MyService.Inst.GetService<MessageApiController>();
                        try
                        {
                            // Wait to see if we get cancelled...
                            while (!_cts.Token.WaitHandle.WaitOne(ExecutionLoopDelayMs))
                            {
                                // Otherwise execute our code...
                                ResponseBase<List<EmailMessageSingle>> response =
                                    await messageApiControllerTask.GetUnSentEmailMesseges(10);
                                if (response.Success)
                                {
                                    if (response.ResponseData.Count == 0)
                                    {
                                        await Task.Delay(100000); //No email in database wait 10 sec
                                        continue;
                                    }
                                    foreach (EmailMessageSingle emailMessageSingle in response.ResponseData)
                                    {
                                        ResponseBase responseBaseSendEmail =
                                            await messageApiControllerTask._email.SendEmailAsync(emailMessageSingle);
                                        if (responseBaseSendEmail.Success)
                                        {
                                            ResponseBase responseBaseSetEmailStatus =
                                                await messageApiControllerTask.SetEmailMessageStatusAsSent(
                                                    emailMessageSingle.MessageId);
                                            if (!responseBaseSetEmailStatus.Success)
                                            {
                                                await _logger.LogError(
                                                    "email is sent but its status in database fails to be set as sent " +
                                                    responseBaseSetEmailStatus.Message + " " +
                                                    responseBaseSetEmailStatus.ErrorCode);
                                                //TODO what todo when email is sent but its status in database fails to be set as sent
                                            }
                                        }
                                        else
                                        {
                                            await _logger.LogError(
                                                "sening email fails " +
                                                responseBaseSendEmail.Message + " " +
                                                responseBaseSendEmail.ErrorCode);
                                            //TODO what to do when sening email fails
                                        }
                                    }
                                }
                                else
                                {
                                    await _logger.LogError(
                                        "Getting unsent emails from database fails " +
                                        response.Message + " " +
                                        response.ErrorCode);
                                    //TODO what to do Getting unsent emails from database fails
                                }
                            }
                            //_cts.Token.ThrowIfCancellationRequested();
                        }
                        catch (Exception ex)
                        {
                            await _logger.LogError(
                                ex.Message + " ," + errorCode + " ,TheNeverEndingTask");
                            SendEmailsFromDatabase(); //recursive call
                        }
                    },
                            _cts.Token,
                            TaskCreationOptions.DenyChildAttach | TaskCreationOptions.LongRunning);
                // Do not forget to observe faulted tasks - for NeverEndingTask faults are probably never desirable
                //TheNeverEndingTask.ContinueWith(x =>
                //{
                //    string kk = "";
                //    // Log/Fire Events etc.
                //}, TaskContinuationOptions.OnlyOnFaulted);
                
                TheNeverEndingTask.Start();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " ," + errorCode);
            }
        }

        private static bool NeverEndingTaskStarted = false;
        public string StartSendEmailsFromDatabase()
        {
            if (!NeverEndingTaskStarted)
            {
                NeverEndingTaskStarted = true;
                _cts=new CancellationTokenSource();
                SendEmailsFromDatabase();
                return "Started";
            }
            else
            {
                return "Already runing";
            }
        }

        public  string StopSendEmailsFromDatabase()
        {
            // This code should be reentrant...
            if (NeverEndingTaskStarted)
            {
                NeverEndingTaskStarted = false;
                _cts.Cancel();
                TheNeverEndingTask.Wait();
            }

            return "Stopped";
        }

        private SmsMessageSingle convertSmsMessageToSmsMessageSingle(SmsMessage smsMessage)
        {
            SmsMessageSingle tempSmsMessageSingle = new SmsMessageSingle();
            tempSmsMessageSingle.PhoneNumber = smsMessage.User.PhoneNumber;
            tempSmsMessageSingle.TextMessage = smsMessage.TextMessage;
            tempSmsMessageSingle.MessageId = smsMessage.MessageId;

            return tempSmsMessageSingle;
        }

        private EmailMessageSingle convertEmailMessageToEmailMessageSingle(EmailMessage emailMessage)
        {
            EmailMessageSingle tempEmailMessageSingle = new EmailMessageSingle();
            tempEmailMessageSingle.EmailAddress = emailMessage.User.Email;
            tempEmailMessageSingle.Subject = emailMessage.Subject;
            tempEmailMessageSingle.Title = emailMessage.TitleMessage;
            tempEmailMessageSingle.TextMessage = emailMessage.TextMessage;
            tempEmailMessageSingle.MessageId = emailMessage.MessageId;

            return tempEmailMessageSingle;
        }
    }


}
