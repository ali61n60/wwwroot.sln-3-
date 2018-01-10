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
        private readonly string DirectoryPath;
        private readonly string TempImagesFolderName = "TempImagesFolderName/";
        private readonly string FirstAdImageName = "0.jpeg";

        public ImageRepositoryFileSystem(string directoryPath)
        {
            DirectoryPath = directoryPath;
        }

        public void SaveImages(Guid advertisementGuid, string[] images)
        {
            string directoryPathString = DirectoryPath + advertisementGuid;
            Directory.CreateDirectory(directoryPathString);

            for (int i = 0, fileName = 0; i < images.Length; i++)
                if (images[i] != null)
                {
                    string fullFileName = directoryPathString + "/" + fileName++ + ".jpeg";
                    using (FileStream imageFileStream = File.Create(fullFileName))
                    {
                        byte[] byteImage = Convert.FromBase64String(images[i]);
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
                string directoryPathString = DirectoryPath + advertisementGuid;
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
                string directoryPathString = DirectoryPath + advertisementGuid.ToString();
                //DirectoryInfo dir = Directory.CreateDirectory(directoryPathString);
                string[] fileImages = Directory.GetFiles(directoryPathString, "*.jpeg", SearchOption.TopDirectoryOnly);


                if (fileImages.Length > 0)
                {
                    foreach (string fileImage in fileImages)
                    {
                        // ReSharper disable once StringIndexOfIsCultureSpecific.1
                        if (fileImage.IndexOf(FirstAdImageName) > 0)
                        {
                            FileStream fileStream;
                            using (fileStream = new FileStream(fileImage, FileMode.Open, FileAccess.Read))
                            {
                                if (fileStream.CanRead)
                                {
                                    byte[] bytesToRead = new byte[fileStream.Length];
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
            string directoryPathString = DirectoryPath + advertisementGuid;
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

        public async Task<string> SaveTempFile(IFormFile file, byte[] thumbnailFile, Guid currentAdGuid)
        {
            string currentAdDirectoryPath = DirectoryPath +currentAdGuid;
            if (!Directory.Exists(currentAdDirectoryPath))
                Directory.CreateDirectory(currentAdDirectoryPath);
            //string filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            string filename = "0.jpeg";//TODO get file name based on files in directory
            string thumbnailFileName = "thumbnail-" + filename;//magic string
            string filenameWithPath = currentAdDirectoryPath + $@"/{filename}";
            string thumbnailFileNameWithPath = currentAdDirectoryPath + $@"/{thumbnailFileName}";
            
            using (FileStream fs = File.Create(filenameWithPath))
            {
                await file.CopyToAsync(fs);
                fs.Flush();
            }
            using (FileStream fs=File.Create(thumbnailFileNameWithPath))
            {
                await fs.WriteAsync(thumbnailFile,0,thumbnailFile.Length);
                fs.Flush();
            }
            return filename;
        }

        public async Task RemoveTempFile(string fileNameToBeRemoved, string userEmail)
        {
            string tempFilesDirectoryPath = DirectoryPath + "TempFiles/" + userEmail;
            if (!Directory.Exists(tempFilesDirectoryPath))
                return;
            string fileName = tempFilesDirectoryPath + $@"\{fileNameToBeRemoved}";
            string thumnNalFileName = tempFilesDirectoryPath + $@"\thumbnail-{fileNameToBeRemoved}";
            File.Delete(fileName);
            File.Delete(thumnNalFileName);
        }

        public async Task<bool> PermanentTempImages(Guid newAdGuid, string userEmail)
        {
            //TODO move users temp imeage into its own ad folder image
            string tempFilesDirectoryPathString = DirectoryPath + TempImagesFolderName + userEmail;
            string targetDirectoryPathString = DirectoryPath + newAdGuid;

            string[] fileImages = Directory.GetFiles(tempFilesDirectoryPathString, "*.jpeg", SearchOption.TopDirectoryOnly);
            
            if (fileImages.Length > 0)
            {
                foreach (string fileImage in fileImages)
                {
                    File.Move(fileImage, targetDirectoryPathString);
                    File.Delete(fileImage);
                }
            }


            return false;
        }
    }
}

