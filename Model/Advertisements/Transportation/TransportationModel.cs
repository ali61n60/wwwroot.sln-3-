using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements.Transportation
{
    [DataContract]
    public class TransportationModel
    {
        public TransportationModel():this(-1,"",-1){}
        public TransportationModel(int modelId, string modelName, int brandId)
        {
            ModelId = modelId;
            ModelName = modelName;
            BrandId = brandId;
        }
        [DataMember]
        public int ModelId { get; private set; }
        
        [DataMember]
        public string ModelName { get; private set; }
        [DataMember]
        public int BrandId { get; private set; }
    }
}
