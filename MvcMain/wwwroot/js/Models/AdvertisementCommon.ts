export class AdvertisementCommon {
    public advertisementId: number;
    public userId: string;
    public phoneNumber: string;
    public email: string;
    public advertisementCategoryId: number;
    public advertisementCategory: string;
    public districtId: number;
    public districtName: string;
    public cityName: string;
    public provinceName: string;
    public advertisementTime: string; //TODO real type is DateTime in C#
    public advertisementStatusId: number;
    public advertisementStatus: string;
    public advertisementTitle: string;
    public advertisementComments: string;
    public numberOfVisit: number;
    public advertisementPrice: number;//TODO real type is Price in C#
    public adPrivilegeId: number;
    public advertisementImages: string[];
}