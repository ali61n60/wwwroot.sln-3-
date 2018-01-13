using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Advertisements.Location;
using ModelStd.Db.Ad;
using ModelStd.Services;
using MvcMain.Controllers;

namespace MvcMain.Components
{
    //TODO error handling for repository calls
    public class LocationViewComponent : ViewComponent
    {
        private readonly LocationApiController _locationApiController;

        public LocationViewComponent(LocationApiController locationApiController)
        {
            _locationApiController = locationApiController;
        }

        public IViewComponentResult Invoke()
        {
            AllLocations allLocations=new AllLocations();

            ResponseBase<IEnumerable<Province>>  provinceResponse = _locationApiController.GetAllProvinces();
            ResponseBase<IEnumerable<City>> cityResponse = _locationApiController.GetAllCities();
            ResponseBase<IEnumerable<District>> districtResponse = _locationApiController.GetAllDistricts();
            if ( provinceResponse.Success && cityResponse.Success && districtResponse.Success)
            {
                allLocations.AllProvinces =  provinceResponse.ResponseData;
                allLocations.AllCities = cityResponse.ResponseData;
                allLocations.AllDistricts = districtResponse.ResponseData;
            }
            else
            {
                string errorMessage = "";
                if (!provinceResponse.Success) errorMessage += provinceResponse.Message + provinceResponse.ErrorCode;
                if(!cityResponse.Success) errorMessage += cityResponse.Message + cityResponse.ErrorCode;
                if (!districtResponse.Success) errorMessage += districtResponse.Message + districtResponse.ErrorCode;
                return View("ComponentError", errorMessage);
            }
            
            return View(allLocations);
        }
    }

    public class AllLocations
    {
        public IEnumerable<Province> AllProvinces;
        public IEnumerable<City> AllCities;
        public IEnumerable<District> AllDistricts;
    }
}
