using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Services.Server.Interfaces
{
    public interface IAdTransportationApi
    {
        Task<ResponseBase<int>> GetServerDataVersion();
        Task<ResponseBase<CarModel[]>> GetAllTransportationModels();
        Task<ResponseBase<Brand[]>> GetAllTransportationBrands();

        ResponseBase AddNewAdvertisementTransportation(AdvertisementTransportation adTransportation,
            string encryptWithServerKey, string s);
    }
}