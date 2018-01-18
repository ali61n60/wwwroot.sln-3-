export class AdvertisementCommon {
    public AdvertisementId: number;
    public UserId: string;
    public PhoneNumber: string;
    public Email: string;
    public AdvertisementCategoryId: number;
    public AdvertisementCategory: string;
    public DistrictId: number;
    public DistrictName: string;
    public CityName: string;
    public ProvinceName: string;
    public AdvertisementTime: string; //TODO real type is DateTime in C#
    public AdvertisementStatusId: number;
    public AdvertisementStatus: string;
    public AdvertisementTitle: string;
    public AdvertisementComments: string;
    public NumberOfVisit: number;
    public AdvertisementPrice: number;//TODO real type is Price in C#
    public AdPrivilegeId: number;
    public AdvertisementImages: string[];
}