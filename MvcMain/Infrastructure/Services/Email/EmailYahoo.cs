using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ModelStd;
using ModelStd.Services;

namespace MvcMain.Infrastructure.Services.Email
{
    public class EmailYahoo:IEmail
    {
        public Task<ResponseBase> SendEmailAsync(EmailMessageSingle emailMessageSingle)
        {
            throw new NotImplementedException();
        }
    }
}
