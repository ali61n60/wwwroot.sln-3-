using System;
using ModelStd.Db;
using ModelStd.Db.Ad;


namespace ModelStd.Advertisements
{
    public class AdvertisementCommon
    {
        public AdvertisementCommon() : this(10) { }
        public AdvertisementCommon(int maxImageNumber)
        {
            AdvertisementImages=new string[maxImageNumber];
            AdvertisementPrice = new Price();
        }
        
        public Guid AdvertisementId { get; set; }
        
        public Guid UserId { get; set; }
        
        public string PhoneNumber { get; set; }
        
        public string Email { get; set; }
        
        public int AdvertisementCategoryId { get; set; }
        
        public string AdvertisementCategory { get; set; }
        
        public int DistrictId { get; set; }
        
        public string DistrictName { get; set; }
        
        public string CityName { get; set; }
        
        public string ProvinceName { get; set; }
        
        public DateTime AdvertisementTime { get; set; }
        
        public int AdvertisementStatusId { get; set; }
        
        public string AdvertisementStatus { get; set; }
        
        public string AdvertisementTitle { get; set; }
        
        public string AdvertisementComments { get; set; }
        
        public int NumberOfVisit { get; set; }
        
        public Price AdvertisementPrice { get; set; }
        
        public int AdPrivilegeId { get; set; } 
        
        public string[] AdvertisementImages { get; set; }
    }
}