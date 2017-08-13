
namespace ModelStd.Advertisements.Transportation
{
    
    public class TransportationBrand
    {
        public TransportationBrand(int brandId, string brandName)
        {
            BrandId = brandId;
            BrandName = brandName;
        }
        
        public int BrandId { get; private set; }
        
        public string BrandName { get; private set; }
    }
}
