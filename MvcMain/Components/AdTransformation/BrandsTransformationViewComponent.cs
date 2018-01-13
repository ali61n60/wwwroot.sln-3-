using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace MvcMain.Components.SearchAd.AdTransformation
{
    public class BrandsTransformationViewComponent : ViewComponent
    {
        private readonly ITransportaionRepository _transportationRepository;
        public BrandsTransformationViewComponent(ITransportaionRepository transportationRepository)
        {
            _transportationRepository = transportationRepository;
        }
        public IViewComponentResult Invoke()
        {
            IEnumerable<Brand> allBrands = _transportationRepository.GetAllBrands();
            IEnumerable<CarModel> allCarModels = _transportationRepository.GetAllModels();
            AllVihecles allVihecles=new AllVihecles
            {
                AllBrands = allBrands,
                AllCarModels = allCarModels
            };
            return View(allVihecles);
        }
    }

    public class AllVihecles
    {
        public IEnumerable<Brand> AllBrands;
        public IEnumerable<CarModel> AllCarModels;
    }
}
