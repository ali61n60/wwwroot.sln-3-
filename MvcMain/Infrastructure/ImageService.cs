using System;
using System.IO;

//using System.Drawing;
//using System.Drawing.Drawing2D;
//using System.Drawing.Imaging;
using ModelStd.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace MvcMain.Infrastructure
{
    public static class ImageService
    {
        public static ResponseBase<byte[]> ConvertImage(int newWidth ,int newHeight , Stream sourcePath )
        {
            ResponseBase<byte[]> convertResponse = new ResponseBase<byte[]>();
            string errorCode = "ImageService.ConvertImage";
            try
            {                
                convertResponse.ResponseData = GetThumbnailsFromStream(newWidth, newHeight, sourcePath);
                convertResponse.Success = true;
                convertResponse.Message = "Successfully converted";
            }
            catch (Exception ex)
            {
                convertResponse.SetFailureResponse("Error in convertion\n" + ex.Message,errorCode);
                convertResponse.ResponseData = null;
            }
            return convertResponse;
        }

        private static byte[] GetThumbnailsFromStream(int newWidth, int newHeight, Stream sourcePath)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (Image<Rgba32> image = Image.Load(sourcePath))
            {
                image.Mutate(x => x.Resize(newWidth, newHeight));
                image.Save(memoryStream,new JpegEncoder());
                
            }
            return memoryStream.ToArray();
        }
    }
}
