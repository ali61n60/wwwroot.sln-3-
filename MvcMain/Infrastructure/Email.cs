using MimeKit;
using MailKit.Net.Smtp;
using MvcMain.Models.Email;

namespace CommonServices
{
    public class Email : IEmail
    {
       public void SendEmail(string emailAddress, EmailMessage message)
        {
            MimeMessage emailMessage = new MimeMessage();
            BodyBuilder bodyBuilder = new BodyBuilder();

            bodyBuilder.HtmlBody = $"<h1>{message.Title}</h1><br/>" +
                                   $"متن پیام" +
                                   $"<br/>" +
                                   $"{message.MessageDetail}" +
                                   $"<br/>" +
                                   $"{message.Email}<br/>";

            emailMessage.Body = bodyBuilder.ToMessageBody();

            emailMessage.From.Add(new MailboxAddress("Admin of whereismycar.ir", "admin@whereismycar.ir"));
            emailMessage.To.Add(new MailboxAddress("", emailAddress));
            emailMessage.Subject = message.Title;

            using (var client = new SmtpClient())
            {
                client.Connect("mail.whereismycar.ir", 25);
                // Note: since we don't have an OAuth2 token, disable
                // the XOAUTH2 authentication mechanism.
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                // Note: only needed if the SMTP server requires authentication
                client.Authenticate("admin@whereismycar.ir", "119801");
                
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }
    }
}
