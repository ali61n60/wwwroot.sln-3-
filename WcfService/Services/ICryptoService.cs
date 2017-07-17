using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceContract]
    public interface ICryptoService
    {
        [OperationContract]
        ResponseBase<int> GetKeyVersion();

        [OperationContract]
        ResponseBase<String> GetPublicKey();
    }
}
