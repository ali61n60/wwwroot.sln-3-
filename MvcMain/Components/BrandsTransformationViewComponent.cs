using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ModelStd.Db.Ad;
using ModelStd.IRepository;

namespace MvcMain.Components
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
            //TODO get all brands from database and pass it to view to render
            IEnumerable<Brand> allBrands = _transportationRepository.GetAllBrands();
            return View(allBrands);
        }
    }

    public class AllVihecles
    {
        public IEnumerable<Brand> AllBrands;
        public IEnumerable<CarModel> AllCarModels;
    }
}
