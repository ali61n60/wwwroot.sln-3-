using System;
using System.ServiceModel;
using Model.Advertisements;
using WcfService.Messages;
using System.ServiceModel.Web;
using Model.Advertisements.Transportation;

namespace WcfService.Services
{
    [ServiceContract]
    public interface IAdvertisementTransportationService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        ResponseBase<Vehicle[]> GetAllVehicles();

        [OperationContract]
        ResponseBase<AdvertisementTransportation> GetAdvertisementTransportation(Guid AdvertisementGuid); 

        [OperationContract]
        ResponseBase AddNewAdvertisementTransportation(
            AdvertisementTransportation advertisementTransportation,string userName,string password,bool userPassIsEncrypted);

        [OperationContract]
        ResponseBase EditAdvertisementTransportation(AdvertisementTransportation advertisementTransportation);
        
        [OperationContract]
        ResponseBase<TransportationBrand[]> GetAllTransportationBrands();

        [OperationContract]
        ResponseBase<TransportationModel[]> GetAllTransportationModels();

        [OperationContract]
        ResponseBase<int> GetServerDataVersion();
    }
}
