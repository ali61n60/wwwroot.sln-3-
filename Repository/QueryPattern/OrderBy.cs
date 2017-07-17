using System.Runtime.Serialization;
namespace Repository.QueryPattern
{
   [DataContract]
    public enum OrderBy  
    {
        [EnumMember]
        DateAsc,
        [EnumMember]
        DateDesc,
        [EnumMember]
        PriceAsc,
        [EnumMember]
        PriceDesc
    }
}
