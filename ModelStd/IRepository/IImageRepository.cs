using System;
using System.Collections.Generic;
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
       Task<string> SaveTempFile(IFormFile file, byte[] thumbnailFile, Guid currentAdGuid);
       Task RemoveTempFile(string fileNameToBeRemoved, Guid currentAdGuid);
       Task<IEnumerable<string>> GetAllAdIdsFolderName();
       void MoveFolderToImagesWithoutAdDirectory(string folder);
   }
}
