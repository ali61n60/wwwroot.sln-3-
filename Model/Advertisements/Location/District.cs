using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Model.Advertisements.Location
{
    [DataContract]
    public class District
    {
         [DataMember]
        public int DistrictId { get; internal set; }
         [DataMember]
         public string DistrictName { get; internal set; }
        [DataMember]
        public int CityId { get; internal set; } 
        [DataMember]
        public int MunicipalId { get; internal set; } 

        public District()
        {
            DistrictId = -1;
            DistrictName = "";
            CityId = -1;
            MunicipalId = -1;


        }

        public District(int districtId,string districtName, int cityId, int municipalId)
        {
            DistrictId = districtId;
            DistrictName = districtName;
            CityId = cityId;
            MunicipalId = municipalId;

        }

    }
}
