using System;
using System.Runtime.Remoting.Messaging;
using System.Runtime.Serialization;
using System.Web.Script.Serialization;
using Model.Advertisements;

namespace Model.Advertisements
{
    
   [DataContract]
    public class AdvertisementCommon
    {
        public AdvertisementCommon() : this(10) { }
        public AdvertisementCommon(int maxImageNumber)
        {
            AdvertisementImages=new string[maxImageNumber];
            AdvertisementPrice = new Price();
        }
        [DataMember]
        public Guid AdvertisementId { get; set; }
        [DataMember]
        public Guid UserId { get; set; }
        [DataMember]
        public string PhoneNumber { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public int AdvertisementCategoryId { get; set; }
        [DataMember]
        public string AdvertisementCategory { get; set; }
        [DataMember]
        public int DistrictId { get; set; }
        [DataMember]
        public string DistrictName { get; set; }
        [DataMember]
        public string CityName { get; set; }
        [DataMember]
        public string ProvinceName { get; set; }
        [DataMember]
        public DateTime AdvertisementTime { get; set; }
        [DataMember]
        public int AdvertisementStatusId { get; set; }
        [DataMember]
        public string AdvertisementStatus { get; set; }
        [DataMember]
        public string AdvertisementTitle { get; set; }
        [DataMember]
        public string AdvertisementComments { get; set; }
        [DataMember]
        public int NumberOfVisit { get; set; }
        [DataMember]
        public Price AdvertisementPrice { get; set; }
        [DataMember]
        public int AdPrivilageId { get; set; } 
        [DataMember]
        public string[] AdvertisementImages { get; set; }
    }
}