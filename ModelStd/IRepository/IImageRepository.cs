using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ModelStd.IRepository
{
   public interface IImageRepository
   {
       void SaveImages(Guid advertisementGuid,string[] Images);
       string[] GetAllAdvertisementImages(Guid advertisementGuid);
       string GetFirstAdvertisementImage(Guid advertisementGuid);
       void RemoveAdvertisementImages(Guid advertisementGuid);
       int MaximumNumberOfImagesPerAdvertisement();
       int MaximumImageSizeInByte();
       Task SaveTempFile(IFormFile file, byte[] thumbnailFile, string userEmail);
       Task RemoveTempFile(string fileNameToBeRemoved, string userEmail);
       Task<bool> PermanentTempImages(Guid newAdGuid, string userEmail);
   }
}
