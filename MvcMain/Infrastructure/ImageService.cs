using System;
using System.IO;

//using System.Drawing;
//using System.Drawing.Drawing2D;
//using System.Drawing.Imaging;
using ModelStd.Services;

namespace WcfService.Services
{
    public static class ImageService
    {
        public static ResponseBase<byte[]> ConvertImage(int newWidth ,int newHeight , Stream sourcePath )
        {
            ResponseBase<byte[]> convertResponse = new ResponseBase<byte[]>();
            string errorCode = "ImageService.ConvertImage";
            try
            {                
                convertResponse.ResponseData = GetThumbnailsFromStream
                    (newWidth, newHeight, sourcePath);
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
            //Image image = Image.FromStream(sourcePath);
            //Bitmap thumbnailImg = new Bitmap(newWidth, newHeight);
            //Graphics thumbGraph = Graphics.FromImage(thumbnailImg);
            //Rectangle imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
            MemoryStream ms = new MemoryStream();

            //thumbGraph.CompositingQuality = CompositingQuality.HighSpeed;
            //thumbGraph.SmoothingMode = SmoothingMode.HighSpeed;
            //thumbGraph.InterpolationMode = InterpolationMode.Low;
            //thumbGraph.DrawImage(image, imageRectangle);
            //thumbnailImg.Save(ms, ImageFormat.Jpeg);
            return ms.ToArray();
        }
    }
}
