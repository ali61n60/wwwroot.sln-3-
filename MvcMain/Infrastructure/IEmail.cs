using MvcMain.Models.Email;

namespace CommonServices  
{
   public interface IEmail
    {
        void SendEmail(string emailAddress, EmailMessage message);
    }
}
