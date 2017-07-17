using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using Model.Advertisements.Location;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceContract]
    interface ILocationService
    {

        [OperationContract]
        ResponseBase<int> GetLocationyVersion();

        [OperationContract]
        ResponseBase<Province[]> GetAllProvinces();

        [OperationContract]
        ResponseBase<City[]> GetAllCities();

        [OperationContract]
        ResponseBase<District[]> GetAllDistricts(); 
    }
}
