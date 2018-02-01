using System.Threading.Tasks;
using ChiKoja.Services.Server.Interfaces;
using ModelStd.Advertisements.Location;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Services.Server
{
    public class LocationApi:ILocationApi
    {
        public async Task<ResponseBase<int>> GetLocationyVersion()
        {
            return await ServicesCommon.CallService<int>("api/LocationApi/GetLocationyVersion");
        }

        public async Task<ResponseBase<Province[]>> GetAllProvinces()
        {
            return await ServicesCommon.CallService<Province[]>("api/LocationApi/GetAllProvinces");
        }

        public async Task<ResponseBase<District[]>> GetAllDistricts()
        {
            return await ServicesCommon.CallService<District[]>("api/LocationApi/GetAllDistricts");
        }

        public async Task<ResponseBase<City[]>> GetAllCities()
        {
            return await ServicesCommon.CallService<City[]>("api/LocationApi/GetAllCities");
        }
    }
}