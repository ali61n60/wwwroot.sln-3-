using Model.Advertisements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model.Advertisements.Transportation;

namespace Model.IRepository
{
    public interface ITransportaionRepository
    {
        Vehicle[] GetAllVehicles();
        TransportationBrand[] GetAllBrands();
        TransportationModel[] GetAllModels();
    }
}
