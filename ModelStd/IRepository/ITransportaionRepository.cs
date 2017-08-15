using ModelStd.Advertisements.Transportation;

namespace ModelStd.IRepository
{
    public interface ITransportaionRepository
    {
        Vehicle[] GetAllVehicles(string connectionString);
        TransportationBrand[] GetAllBrands(string connectionString);
        TransportationModel[] GetAllModels(string connectionString);
    }
}
