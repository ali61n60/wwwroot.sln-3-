using System;
using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;
using ModelStd;
using ModelStd.Services;
using MvcMain.Models.Email;

namespace MvcMain.Infrastructure
{
    public class Email : IEmail
    {
        public async Task<ResponseBase> SendEmailAsync(EmailMessageSingle emailMessageSingle)
        {
            string errorCode = "Email/SendEmailAsync";
            ResponseBase response=new ResponseBase();
            MimeMessage emailMessage = new MimeMessage();
            BodyBuilder bodyBuilder = new BodyBuilder();

            bodyBuilder.HtmlBody = $"<h1>{emailMessageSingle.Title}</h1><br/>" +
                                   $"متن پیام" +
                                   $"<br/>" +
                                   $"{emailMessageSingle.TextMessage}" +
                                   $"<br/>";

            emailMessage.Body = bodyBuilder.ToMessageBody();
            emailMessage.From.Add(new MailboxAddress("Admin of whereismycar.ir", "admin@whereismycar.ir"));
            emailMessage.To.Add(new MailboxAddress(emailMessageSingle.EmailAddress));
            emailMessage.Subject = emailMessageSingle.Subject;
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Connect("mail.whereismycar.ir", 25);
                    // Note: since we don't have an OAuth2 token, disable
                    // the XOAUTH2 authentication mechanism.
                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    // Note: only needed if the SMTP server requires authentication
                    client.Authenticate("admin@whereismycar.ir", "119801");

                    await client.SendAsync(emailMessage);
                    client.Disconnect(true);
                }
                response.SetSuccessResponse();
            }
            catch (Exception ex)
            {
                response.SetFailureResponse(ex.Message,errorCode);
            }

            return response;
        }
    }
}
