﻿using System.Collections.Generic;
using ModelStd.Db.Ad;

namespace ModelStd.IRepository
{
    public interface ITransportaionRepository
    {
        IEnumerable<Brand> GetAllBrands();
        IEnumerable<CarModel> GetAllModels();
    }
}
