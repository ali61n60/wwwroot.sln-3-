using ModelStd.Advertisements.Transportation;

namespace ModelStd.IRepository
{
    public interface ITransportaionRepository
    {
        Vehicle[] GetAllVehicles();
        TransportationBrand[] GetAllBrands();
        TransportationModel[] GetAllModels();
    }
}
