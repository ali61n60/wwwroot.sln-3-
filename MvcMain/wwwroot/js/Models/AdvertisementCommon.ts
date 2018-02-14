export class AdvertisementCommon {
    public AdId: number;
    public UserId: string;
    public PhoneNumber: string;
    public Email: string;
    public CategoryId: number;
    public CategoryName: string;
    public DistrictId: number;
    public DistrictName: string;
    public CityName: string;
    public ProvinceName: string;
    public AdTime: string; //real type is DateTime in C#
    public AdStatus: string;
    public AdTitle: string;
    public AdComments: string;
    public NumberOfVisits: number;
    public AdPrice: any;//TODO real type is Price in C#
    public AdPrivilegeId: number;
    public AdImages: string[];
    public AdType:string;

}