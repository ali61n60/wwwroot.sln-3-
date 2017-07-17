using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Threading.Tasks;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RepositoryService:IRepositoryService
    {
        public ResponseBase<int> GetMainServerDataVersion()
        {
            string errorCode = "RepositoryService.GetMainServerDataVersion";
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 4 //TODO create an xml-base file and read this value from xml file
            };
            response.SetSuccessResponse();
            return response;
        }
    }
}
