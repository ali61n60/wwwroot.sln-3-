using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using WcfService.Messages;

namespace WcfService.Services
{
     [ServiceContract]
    public interface IServiceCommon
    {
         [OperationContract]
         ResponseBase<int> GetServerDataVersion(); 
    }
}
