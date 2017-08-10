namespace ModelStd.Advertisements.Transportation
{
    
    public class TransportationModel
    {
        public TransportationModel():this(-1,"",-1){}
        public TransportationModel(int modelId, string modelName, int brandId)
        {
            ModelId = modelId;
            ModelName = modelName;
            BrandId = brandId;
        }
        
        public int ModelId { get; private set; }
        
      
        public string ModelName { get; private set; }
        
        public int BrandId { get; private set; }
    }
}
