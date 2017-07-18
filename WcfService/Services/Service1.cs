using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Web;

namespace WcfService.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in both code and config file together.
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Service1 : IService1
    {
        public string GetRootPath()
        {
           return HttpContext.Current.Server.MapPath("~/");
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }

        public string SayHello()
        {
            return "Hello Mvc core again";
        }

        public string SayHello2()
        {
            return "Hello Mvc core again in SayHello2";
        }
    }
}




