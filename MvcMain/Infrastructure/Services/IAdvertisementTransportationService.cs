using System;
using System.Threading.Tasks;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
    
    public interface IAdvertisementTransportationService
    {
      //  ResponseBase<Vehicle[]> GetAllVehicles();
      
     

        
       // ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
        
        
      //  ResponseBase<TransportationBrand[]> GetAllTransportationBrands();

        
       // ResponseBase<TransportationModel[]> GetAllTransportationModels();

        
        ResponseBase<int> GetServerDataVersion();
        ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId);
        Task<ResponseBase> AddNewAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
    }
}
