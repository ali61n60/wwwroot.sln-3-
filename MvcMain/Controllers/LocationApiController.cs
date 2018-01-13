using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements.Location;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    //TODO get data from repository and return it in method calls.
    // a good practice maybe is to load data from database on app start and use that data instead of calling database each time 
    [Route("api/[controller]/[action]")]
    public class LocationApiController:Controller
    {
        public ResponseBase<int> GetLocationyVersion()
        {
            ResponseBase<int> response = new ResponseBase<int>
            {
                ResponseData = 2
            };
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<Province>> GetAllProvinces()
        {
            //TODO gat data from repository
            List<Province> provinces = new List<Province>();
            ResponseBase<IEnumerable<Province>> response = new ResponseBase<IEnumerable<Province>>();
            provinces.Add(new Province(1, "tehran", "tehran"));
            provinces.Add(new Province(2, "qom", "qom"));
            provinces.Add(new Province(3, "alborz", "karaj"));
            response.ResponseData = provinces.ToArray();
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<City>> GetAllCities()
        {
            //TODO gat data from repository
            List<City> cities = new List<City>();
            ResponseBase<IEnumerable<City>> response = new ResponseBase<IEnumerable<City>>();
            cities.Add(new City(1, "tehran", 1));
            cities.Add(new City(2, "eslamShar", 1));
            cities.Add(new City(3, "malard", 3));
            response.ResponseData = cities.ToArray();
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<District>> GetAllDistricts()
        {
            //TODO gat data from repository
            List<District> districts = new List<District>();
            ResponseBase<IEnumerable<District>> response = new ResponseBase<IEnumerable<District>>();
            districts.Add(new District(1, "poonak", 1, 1));
            districts.Add(new District(2, "valiasr", 1, 1));
            districts.Add(new District(3, "resalat", 1, 1));
            districts.Add(new District(29, "NematAbad", 1, 1));
            response.ResponseData = districts.ToArray();
            response.SetSuccessResponse();
            return response;
        }
    }
}
