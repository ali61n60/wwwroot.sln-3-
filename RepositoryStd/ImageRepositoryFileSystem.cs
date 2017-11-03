using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using ModelStd.IRepository;

namespace RepositoryStd
{
    public class ImageRepositoryFileSystem : IImageRepository
    {
        private readonly string _directoryPath;

        public ImageRepositoryFileSystem(string directoryPath)
        {
            _directoryPath = directoryPath;
        }

        public void SaveImages(Guid advertisementGuid, string[] Images)
        {
            string directoryPathString = _directoryPath + advertisementGuid;
            Directory.CreateDirectory(directoryPathString);

            for (int i = 0, fileName = 0; i < Images.Length; i++)
                if (Images[i] != null)
                {
                    string fullFileName = directoryPathString + "/" + fileName++ + ".jpeg";
                    using (FileStream imageFileStream = File.Create(fullFileName))
                    {
                        byte[] byteImage = Convert.FromBase64String(Images[i]);
                        imageFileStream.Write(byteImage, 0, byteImage.Length);
                    }
                }
        }

        public string[] GetAllAdvertisementImages(Guid advertisementGuid)
        {
            FileStream fileStream;
            string[] advertisementImages = null;

            try
            {
                string directoryPathString = _directoryPath + advertisementGuid;
                string[] fileImages = Directory.GetFiles(directoryPathString, "*.jpeg", SearchOption.TopDirectoryOnly);
                advertisementImages = new string[fileImages.Length];

                for (int i = 0, j = 0; i < fileImages.Length; i++)
                {
                    using (fileStream = new FileStream(fileImages[i], FileMode.Open, FileAccess.Read))
                    {
                        if (fileStream.CanRead)
                        {
                            var bytesToRead = new byte[fileStream.Length];
                            fileStream.Read(bytesToRead, 0, (int)fileStream.Length);
                            advertisementImages[j++] = Convert.ToBase64String(bytesToRead);
                        }
                    }
                }
            }
            catch (Exception)
            {
                //TODO decide what to to in case of exception
            }
            return advertisementImages;
        }

        public string GetFirstAdvertisementImage(Guid advertisementGuid)
        {
            string firstAdvertisementImage = null;
            try
            {
                string directoryPathString = _directoryPath + advertisementGuid.ToString();
                //DirectoryInfo dir = Directory.CreateDirectory(directoryPathString);
                string[] fileImages = Directory.GetFiles(directoryPathString, "*.jpeg", SearchOption.TopDirectoryOnly);


                if (fileImages.Length > 0)
                {
                    for (int i = 0; i < fileImages.Length; i++)
                    {
                        // ReSharper disable once StringIndexOfIsCultureSpecific.1
                        if (fileImages[i].IndexOf("0.jpeg") > 0)
                        {
                            FileStream fileStream;
                            using (fileStream = new FileStream(fileImages[i], FileMode.Open, FileAccess.Read))
                            {
                                if (fileStream.CanRead)
                                {
                                    var bytesToRead = new byte[fileStream.Length];
                                    fileStream.Read(bytesToRead, 0, (int)fileStream.Length);
                                    firstAdvertisementImage = Convert.ToBase64String(bytesToRead);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                firstAdvertisementImage = null;
                //TODO decide what to to in case of exception
            }
            return firstAdvertisementImage;
        }

        public void RemoveAdvertisementImages(Guid advertisementGuid)
        {
            string directoryPathString = _directoryPath + advertisementGuid;
            if (Directory.Exists(directoryPathString))
            {
                string[] fileNames = Directory.GetFiles(directoryPathString, "*.jpeg", SearchOption.TopDirectoryOnly);
                foreach (string fileName in fileNames)
                {
                    if (File.Exists(fileName))
                    {
                        File.Delete(fileName);
                    }
                }
            }
            if (Directory.Exists(directoryPathString))
            {
                Directory.Delete(directoryPathString);
            }
        }

        public int MaximumNumberOfImagesPerAdvertisement()
        {
            return 5;
        }

        public int MaximumImageSizeInByte()
        {
            int maxImageSizeInByte = 2 * 1024 * 1024;
            return maxImageSizeInByte;
        }

        public async Task SaveTempFile(IFormFile file, byte[] thumbnailFile, string userEmail)
        {
            string tempFilesDirectoryPath = _directoryPath + "TempFiles/" + userEmail;
            if (!Directory.Exists(tempFilesDirectoryPath))
                Directory.CreateDirectory(tempFilesDirectoryPath);
            string filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            string thumbnailFileName = "thumbnail-" + filename;
            filename = tempFilesDirectoryPath + $@"\{filename}";
            thumbnailFileName = tempFilesDirectoryPath + $@"\{thumbnailFileName}";
            using (FileStream fs = File.Create(filename))
            {
                file.CopyTo(fs);
                fs.Flush();
            }
            using (FileStream fs=File.Create(thumbnailFileName))
            {
                fs.Write(thumbnailFile,0,thumbnailFile.Length);
                fs.Flush();
            }
        }
    }
}

