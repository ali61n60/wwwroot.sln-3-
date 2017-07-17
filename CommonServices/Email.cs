using System.Net.Mail;

namespace CommonServices 
{
    public class Email:IEmail
    {
        public void SendEmail( string emailAddress,string message,string subject)
        {
            //TODO log email into database
            MailMessage mailMessage = new MailMessage();
            mailMessage.To.Add(emailAddress);
            mailMessage.From = new MailAddress("mail@ayoobfarsh.ir");
            mailMessage.Subject = subject;
            mailMessage.Body =  message;
            mailMessage.IsBodyHtml = true;
                
            SmtpClient smtpClient = new SmtpClient("smtp.ayoobfarsh.ir", 25);
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.EnableSsl = false;
            smtpClient.Credentials = new System.Net.NetworkCredential("mail@ayoobfarsh.ir", "119801");
            smtpClient.Send(mailMessage);
        }
    }
}
