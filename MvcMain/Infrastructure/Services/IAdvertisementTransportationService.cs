using ModelStd.Services;


namespace MvcMain.Infrastructure.Services
{
    
    public interface IAdvertisementTransportationService
    {
      //  ResponseBase<Vehicle[]> GetAllVehicles();

       
       // ResponseBase<AdvertisementTransportation> GetAdvertisementTransportation(Guid AdvertisementGuid); 

       
      //  ResponseBase AddNewAdvertisementTransportation(
       //     AdvertisementTransportation advertisementTransportation,string userName,string password,bool userPassIsEncrypted);

        
       // ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
        
        
      //  ResponseBase<TransportationBrand[]> GetAllTransportationBrands();

        
       // ResponseBase<TransportationModel[]> GetAllTransportationModels();

        
        ResponseBase<int> GetServerDataVersion();
    }
}
