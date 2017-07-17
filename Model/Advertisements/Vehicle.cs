using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements
{
    [DataContract]
    public class Vehicle
    {
        [DataMember]
        public int ModelId { get; internal set; }
        
        [DataMember]
        public string ModelName { get; internal set; }
        
        [DataMember]
        public int BrandId { get; internal set; }

        [DataMember]
        public string BrandName { get; internal set; }

        /// <summary>
        /// Defualt Constructor
        /// initialize all members to defualt values. ModelId=-1,ModelName="",BrandId=-1,BrandName=""
        /// </summary>
        public Vehicle()
        {
            ModelId = -1;
            ModelName = "";
            BrandId = -1;
            BrandName = "";
           
        }

        /// <summary>
        /// Crates a Vehicle object and initializes its members from input paramaters
        /// </summary>
        /// <param name="modelId"></param>
        /// <param name="modelName"></param>
        /// <param name="brandId"></param>
        /// <param name="brandName"></param>
        public Vehicle(int modelId, string modelName,int brandId, string brandName)
        {
            ModelId = modelId;
            ModelName = modelName;
            BrandId = brandId;
            BrandName = brandName;
        }
    }
}
