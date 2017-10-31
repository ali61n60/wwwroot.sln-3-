using System;
using ModelStd.Advertisements;
using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
    
    public interface IAdvertisementTransportationService
    {
      //  ResponseBase<Vehicle[]> GetAllVehicles();
      
      //  ResponseBase AddNewAdvertisementTransportation(
       //     AdvertisementTransportation advertisementTransportation,string userName,string password,bool userPassIsEncrypted);

        
       // ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
        
        
      //  ResponseBase<TransportationBrand[]> GetAllTransportationBrands();

        
       // ResponseBase<TransportationModel[]> GetAllTransportationModels();

        
        ResponseBase<int> GetServerDataVersion();
        ResponseBase<AdvertisementTransportation> GetAdDetail(Guid adId);
    }
}
