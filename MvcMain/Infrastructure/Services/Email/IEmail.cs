using System.Threading.Tasks;
using ModelStd;
using ModelStd.Services;

namespace MvcMain.Infrastructure.Services.Email
{
   public interface IEmail
    {
        Task<ResponseBase> SendEmailAsync(EmailMessageSingle emailMessageSingle);
    }
}
