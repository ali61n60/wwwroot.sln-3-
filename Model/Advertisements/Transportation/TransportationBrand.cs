using System.Runtime.Serialization;

namespace Model.Advertisements.Transportation
{
    [DataContract]
    public class TransportationBrand
    {
        public TransportationBrand()
        {
            BrandId = -1;
            BrandName = "";
        }
        public TransportationBrand(int brandId, string brandName)
        {
            BrandId = brandId;
            BrandName = brandName;
        }
        [DataMember]
        public int BrandId { get; private set; }
        [DataMember]
        public string BrandName { get; private set; }
    }
}
