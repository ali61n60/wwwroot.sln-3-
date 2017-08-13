namespace ModelStd.Advertisements.Transportation
{
    public class Vehicle
    {
        public int ModelId { get; internal set; }
        public string ModelName { get; internal set; }
        public int BrandId { get; internal set; }
        public string BrandName { get; internal set; }
        public Vehicle(int modelId, string modelName,int brandId, string brandName)
        {
            ModelId = modelId;
            ModelName = modelName;
            BrandId = brandId;
            BrandName = brandName;
        }
    }
}
