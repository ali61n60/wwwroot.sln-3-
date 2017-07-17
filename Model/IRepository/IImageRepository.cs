using System;

namespace Model.IRepository
{
   public interface IImageRepository
   {
       void SaveImages(Guid advertisementGuid,string[] Images);
       string[] GetAllAdvertisementImages(Guid advertisementGuid);
       string GetFirstAdvertisementImage(Guid advertisementGuid);
       void RemoveAdvertisementImages(Guid advertisementGuid);
       int MaximumNumberOfImagesPerAdvertisement();
       int MaximumImageSizeInByte();
   }
}
