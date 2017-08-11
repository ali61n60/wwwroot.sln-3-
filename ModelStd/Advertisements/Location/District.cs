namespace ModelStd.Advertisements.Location
{
    public class District
    {
        public int DistrictId { get; internal set; }
        public string DistrictName { get; internal set; }
        public int CityId { get; internal set; }
        public int MunicipalId { get; internal set; }

        public District()
        {
            DistrictId = -1;
            DistrictName = "";
            CityId = -1;
            MunicipalId = -1;
        }

        public District(int districtId, string districtName, int cityId, int municipalId)
        {
            DistrictId = districtId;
            DistrictName = districtName;
            CityId = cityId;
            MunicipalId = municipalId;

        }
    }
}
