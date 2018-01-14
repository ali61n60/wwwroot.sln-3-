using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
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
            provinces.Add(new Province(){
                ProvinceId = 1,
                ProvinceName = "tehran",
                ProvinceCenter = "tehran"});
            provinces.Add(new Province(){
                ProvinceId = 2,
                ProvinceCenter = "qom",
                ProvinceName = "qom"});
            provinces.Add(new Province(){
                ProvinceId = 3,
                ProvinceName = "alborz",
                ProvinceCenter = "karaj" });
            response.ResponseData = provinces;
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<City>> GetAllCities()
        {
            //TODO gat data from repository
            List<City> cities = new List<City>();
            ResponseBase<IEnumerable<City>> response = new ResponseBase<IEnumerable<City>>();
            cities.Add(new City(){
                CityId = 1,
                CityName = "tehran",
                ProvinceId = 1});
            cities.Add(new City(){CityId = 2,CityName = "eslamShar",ProvinceId = 1});
            cities.Add(new City(){CityId = 3,CityName = "malard",ProvinceId = 3});
            response.ResponseData = cities;
            response.SetSuccessResponse();
            return response;
        }

        public ResponseBase<IEnumerable<District>> GetAllDistricts()
        {
            //TODO gat data from repository
            List<District> districts = new List<District>();
            ResponseBase<IEnumerable<District>> response = new ResponseBase<IEnumerable<District>>();
            districts.Add(new District() {DistrictId = 1,DistrictName = "poonak",CityId = 1,MunicipalId = 1});
            districts.Add(new District() {DistrictId = 2,DistrictName = "valiasr",CityId = 1,MunicipalId = 1});
            districts.Add(new District() {DistrictId = 3,DistrictName = "resalat",CityId = 1,MunicipalId = 1});
            districts.Add(new District() {DistrictId = 29,DistrictName = "NematAbad",CityId = 1,MunicipalId = 1});
            response.ResponseData = districts;
            response.SetSuccessResponse();
            return response;
        }
    }
}
