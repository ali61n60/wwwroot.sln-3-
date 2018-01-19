using System.Threading.Tasks;
using ModelStd;
using MvcMain.Models.Email;

namespace MvcMain.Infrastructure  
{
   public interface IEmail
    {
        Task SendEmail(EmailMessageSingle emailMessageSingle);
    }
}
