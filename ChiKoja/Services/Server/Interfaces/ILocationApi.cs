using System.Threading.Tasks;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface ILocationApi
    {
        Task<ResponseBase<int>> GetLocationyVersion();
        Task<ResponseBase<Province[]>> GetAllProvinces();
        Task<ResponseBase<District[]>> GetAllDistricts();
        Task<ResponseBase<City[]>> GetAllCities();
    }
}