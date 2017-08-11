namespace ModelStd.Advertisements.Location
{
    public class City
    {
        public int CityId { get; internal set; }
         
         public string CityName { get; internal set; }
        
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
