namespace CommonServices  
{
   public interface IEmail
    {
        void SendEmail(string emailAddress, string message, string subject);
    }
}
