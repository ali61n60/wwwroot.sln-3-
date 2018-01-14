using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.IRepository;
using ModelStd.Services;

namespace MvcMain.Controllers
{
    //TODO get data from repository and return it in method calls.
    // a good practice maybe is to load data from database on app start and use that data instead of calling database each time 
    [Route("api/[controller]/[action]")]
    public class LocationApiController:Controller
    {
        private ILocationRepository _locationRepository;

        public LocationApiController(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }
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
            ResponseBase<IEnumerable<Province>> response = new ResponseBase<IEnumerable<Province>>();

            IEnumerable<Province> provinces = _locationRepository.GetAllProvinces();
            response.ResponseData = provinces;
            response.SetSuccessResponse();

            return response;
        }

        public ResponseBase<IEnumerable<City>> GetAllCities()
        {
            ResponseBase<IEnumerable<City>> response = new ResponseBase<IEnumerable<City>>();

            IEnumerable<City> cities = _locationRepository.GetAllCities();
            response.ResponseData = cities;
            response.SetSuccessResponse();

            return response;
        }

        public ResponseBase<IEnumerable<District>> GetAllDistricts()
        {
            ResponseBase<IEnumerable<District>> response = new ResponseBase<IEnumerable<District>>();

            IEnumerable<District> districts = _locationRepository.GetAllDistricts();
            response.ResponseData = districts;
            response.SetSuccessResponse();

            return response;
        }
    }
}
