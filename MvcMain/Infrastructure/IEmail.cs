using MvcMain.Models.Email;

namespace MvcMain.Infrastructure  
{
   public interface IEmail
    {
        void SendEmail(string emailAddress, EmailMessage message);
    }
}
