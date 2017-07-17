using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Threading.Tasks;
using Model.Advertisements.Location;
using WcfService.Messages;

namespace WcfService.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
   public class LocationService:ILocationService
    {
        public ResponseBase<int> GetLocationyVersion()
        {
            ResponseBase<int> response=new ResponseBase<int>();
            response.ResponseData =2;
            response.SetSuccessResponse("OK");
            return response;
        }

       public ResponseBase<Province[]> GetAllProvinces()
       {
           //TODO gat data from repository
           List<Province> provinces=new List<Province>();
           ResponseBase<Province[]> response=new ResponseBase<Province[]>();
           provinces.Add(new Province(1,"tehran","tehran"));
           provinces.Add(new Province(2, "qom", "qom"));
           provinces.Add(new Province(3, "alborz", "karaj"));
           response.ResponseData = provinces.ToArray();
           response.SetSuccessResponse("OK");
           return response;
       }

       public ResponseBase<City[]> GetAllCities()
       {
           //TODO gat data from repository
           List<City> cities = new List<City>();
           ResponseBase<City[]> response = new ResponseBase<City[]>();
           cities.Add(new City(1,"tehran", 1));
           cities.Add(new City(2, "eslamShar", 1));
           cities.Add(new City(3, "malard", 3));
           response.ResponseData = cities.ToArray();
           response.SetSuccessResponse("OK");
           return response;
       }

       public ResponseBase<District[]> GetAllDistricts()
       {
           //TODO gat data from repository
           List<District> districts = new List<District>();
           ResponseBase<District[]> response = new ResponseBase<District[]>();
           districts.Add(new District(1, "poonak", 1, 1));
           districts.Add(new District(2, "valiasr", 1, 1));
           districts.Add(new District(3, "resalat", 1, 1));
           districts.Add(new District(29, "NematAbad", 1, 1));
           response.ResponseData = districts.ToArray();
           response.SetSuccessResponse("OK");
           return response;
       }
    }
}
