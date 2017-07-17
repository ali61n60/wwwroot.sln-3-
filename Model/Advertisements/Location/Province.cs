using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements.Location
{
    [DataContract]
    public class Province
    {
         [DataMember]
        public int ProvinceId { get; internal set; }
        
        [DataMember]
         public string ProvinceName { get; internal set; }
        [DataMember]
        public string ProvinceCenter { get; internal set; } 

        public Province()
        {
            ProvinceId = -1;
            ProvinceName= "";
            ProvinceCenter = "";
        }

        public Province(int provinceId, string provinceName, string provinceCenter)
        {
            ProvinceId = provinceId;
            ProvinceName = provinceName;
            ProvinceCenter = provinceCenter;
        }

    }
}
