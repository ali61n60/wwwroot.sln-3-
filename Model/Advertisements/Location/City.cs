using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements.Location
{
    [DataContract]
    public class City
    {
        [DataMember]
        public int CityId { get; internal set; }
         [DataMember]
         public string CityName { get; internal set; }
        [DataMember]
        public int ProvinceId { get; internal set; } 

        public City()
        {
            CityId = -1;
            CityName = "";
            ProvinceId = -1;
            
        }

        public City(int cityId, string cityName, int provinceId)
        {
            CityId = cityId;
            CityName = cityName;
            ProvinceId = provinceId;
        }
    }
}
