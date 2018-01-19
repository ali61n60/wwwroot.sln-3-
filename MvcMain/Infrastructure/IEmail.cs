using System.Threading.Tasks;
using ModelStd;
using ModelStd.Services;
using MvcMain.Models.Email;

namespace MvcMain.Infrastructure  
{
   public interface IEmail
    {
        Task<ResponseBase> SendEmailAsync(EmailMessageSingle emailMessageSingle);
    }
}
