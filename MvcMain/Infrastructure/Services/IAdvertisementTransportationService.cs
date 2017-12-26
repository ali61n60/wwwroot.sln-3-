using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
    
    public interface IAdvertisementTransportationService
    {
      //  ResponseBase<Vehicle[]> GetAllVehicles();
      
     

        
       // ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
        
        ResponseBase<int> GetServerDataVersion();
        ResponseBase<IEnumerable<Brand>> GetAllTransportationBrands();
        ResponseBase<IEnumerable<CarModel>> GetAllTransportationModels();
        ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId);
        Task<ResponseBase> AddNewAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
    }
}
