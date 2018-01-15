using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
    //TODO 2- try to refactor or remove this interface
    public interface IAdvertisementTransportationService
    {
        ResponseBase<int> GetServerDataVersion();
        ResponseBase<IEnumerable<Brand>> GetAllTransportationBrands();
        ResponseBase<IEnumerable<CarModel>> GetAllTransportationModels();
        ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId);
    }
}
