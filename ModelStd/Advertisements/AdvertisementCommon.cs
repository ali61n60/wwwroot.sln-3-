using System;
using ModelStd.Advertisements.Price;

namespace ModelStd.Advertisements
{
    public class AdvertisementCommon
    {
        public AdvertisementCommon() : this(10) { }
        public AdvertisementCommon(int maxImageNumber)
        {
            AdImages=new string[maxImageNumber];
        }
        
        public Guid AdId { get; set; }
        
        public string UserId { get; set; }
        
        public string PhoneNumber { get; set; }
        
        public string Email { get; set; }
        
        public int CategoryId { get; set; }
        
        public string CategoryName { get; set; }
        
        public int DistrictId { get; set; }
        
        public string DistrictName { get; set; }
        
        public string CityName { get; set; }
        
        public string ProvinceName { get; set; }
        
        public DateTime AdTime { get; set; }
        
        public string AdStatus { get; set; }
        
        public string AdTitle { get; set; }
        
        public string AdComments { get; set; }
        
        public int NumberOfVisits { get; set; }
        
        public IPrice AdPrice { get; set; }
        
        public int AdPrivilegeId { get; set; } 
        
        public string[] AdImages { get; set; }

        public string AdType { get; set; }

        }
}