namespace ModelStd.Advertisements.Location
{
    public class Province
    {
        public int ProvinceId { get; internal set; }
         public string ProvinceName { get; internal set; }
        public string ProvinceCenter { get; internal set; } 
        public Province(int provinceId, string provinceName, string provinceCenter)
        {
            ProvinceId = provinceId;
            ProvinceName = provinceName;
            ProvinceCenter = provinceCenter;
        }
    }
}
