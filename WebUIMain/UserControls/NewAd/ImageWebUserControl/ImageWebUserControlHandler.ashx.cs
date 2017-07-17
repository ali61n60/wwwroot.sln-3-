using Model.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WcfService.IOC;
using WcfService.Services;

namespace WebUIMain.UserControls.NewAd.ImageWebUserControl
{
    /// <summary>
    /// Summary description for ImageWebUserControlHandler
    /// </summary>
    public class ImageWebUserControlHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        IImageRepository imageRepository = Bootstrapper.container.GetInstance<IImageRepository>();
        string response = "";
        int maxImageNumber;
        int maxImageSize ;

        public void ProcessRequest(HttpContext context)
        {
            maxImageNumber = imageRepository.MaximumNumberOfImagesPerAdvertisement();
            maxImageSize = imageRepository.MaximumImageSizeInByte();
            context.Response.ContentType = "text/plain";
            try
            {

                string method = context.Request.Form.Get("method");
                if (method == "addImage")
                {
                    addImage(context);
                    return;
                }
                else if (method == "deleteImage")
                {
                    deleteImageFromSession(context);
                    return;
                }
                else if (method == "recreateLoadedImages")
                {
                    recreateLoadedImages(context);
                    return;
                }
            }
            catch (Exception ex)
            {
                string response = setReturnMessage("false", "در پردازش اطلاعات خطا رخ داده است" + " , WebUIMain.UserControls.NewAd.ProcessRequest");
                context.Response.Write(response);
            }
        }

        //add image inside context into session
        private void addImage(HttpContext context)
        {

            byte[] originalImageBytes;
            int imageIndex;
            HttpFileCollection fileCollection = context.Request.Files;
            HttpPostedFile file = fileCollection.Get("file");
            //check file existance
            if (file == null)
            {
                response = setReturnMessage("false", "هیچ فایلی انتخاب نشده است.");
                context.Response.Write(response);
                return;
            }
            //Check the file size
            else if (file.ContentLength > maxImageSize)
            {
                response = setReturnMessage("false", "حجم فایل بایستی کمتر از 2 مگا بایت باشد.");
                context.Response.Write(response);
                return;
            }
            //choose image index
            else if ((imageIndex = chooseImageIndex(context)) == 0)
            {
                response = setReturnMessage("false", "حداکثر تعداد عکس ها اضافه شده است. در صورت لزوم می توانید ابتدا عکسهای قبلی را حذف نموده و سپس اقدام کنید");
                context.Response.Write(response);
                return;
            }
            //everything OK
            else
            {
                ///reduce image size and store it in imageLowQuality
                originalImageBytes = new byte[file.ContentLength];
                file.InputStream.Read(originalImageBytes, 0, (int)file.ContentLength);

                byte[] imageLowQuality = ImageService.ConvertImage(140, 140, file.InputStream).ResponseData;
                byte[] imageHighQuality = ImageService.ConvertImage(600, 450, file.InputStream).ResponseData;

                string base64StringHighQuality = Convert.ToBase64String(imageHighQuality, 0, imageHighQuality.Length);
                string base64StringLowQuality = Convert.ToBase64String(imageLowQuality, 0, imageLowQuality.Length);
                string[] bothImages = new string[2];
                bothImages[0] = base64StringLowQuality;
                bothImages[1] = base64StringHighQuality;
                string imageId = "image" + imageIndex.ToString();
                context.Session[imageId] = bothImages;
                response = setReturnMessage("true", "عکس اضافه شد", "data:image/jpg;base64," + base64StringLowQuality, imageId);
                context.Response.Write(response);
                return;
            }
        }
        private void deleteImageFromSession(HttpContext context)
        {
            string response = "";
            string Id = context.Request.Form.Get("imageId");
            context.Session[Id] = null;//delete session
            response = setReturnMessage("true", "فایل حذف شد");
            context.Response.Write(response);
            return;
        }
        private void recreateLoadedImages(HttpContext context)
        {
            string response = "";
            List<string[]> imagesList = new List<string[]>();
            for (int i = 1; i <= maxImageNumber; i++)
            {
                string imageId = "image" + i.ToString();
                string imageUrl = "";
                if (context.Session[imageId] != null)
                {
                    imageUrl = "data:image/jpg;base64," + ((string[])context.Session[imageId])[0];//low quality image
                    imagesList.Add(new string[] { imageUrl, imageId });
                }
            }
            response = setReturnMessage("true", imagesList.ToArray());
            context.Response.Write(response);
            return;
        }

        private int chooseImageIndex(HttpContext context)
        {
            int imageIndex = 0;
            for (int i = 1; i <= maxImageNumber; i++)
            {
                string imageID = "image" + i.ToString();

                if (context.Session[imageID] == null)
                {
                    imageIndex = i;
                    break;
                }
            }
            return imageIndex;
        }

        private string setReturnMessage(string status, string message)
        {
            string temp = "{\"status\":\"" + status + "\"";
            temp += ",\"message\":\"" + message + "\"";
            temp += "}";
            return temp;
        }

        private string setReturnMessage(string status, string message, string imageAsString, string imageId)
        {
            string temp = "{\"status\":\"" + status + "\"";
            temp += ",\"message\":\"" + message + "\"";
            temp += ",\"imageUrl\":" + "\"" + imageAsString + "\"";
            temp += ",\"imageId\":" + "\"" + imageId + "\"";
            temp += "}";
            return temp;
        }
        private string setReturnMessage(string status, string[][] imagesUrl)
        {

            string temp = "{\"status\":\"" + status + "\"";
            temp += ",\"numberOfImages\":\"" + imagesUrl.Length.ToString() + "\"";
            if (imagesUrl.Length >= 1)
            {
                temp += ",\"imagesUrl\":[";
                for (int i = 0; i < imagesUrl.Length; i++)
                {
                    temp += "{\"imageUrl\":\"" + imagesUrl[i][0] + "\" , ";
                    temp += "\"imageId\":\"" + imagesUrl[i][1] + "\"";

                    temp += "},";
                }
                temp = temp.Substring(0, temp.Length - 1);//remove last ","
                temp += "]";
            }
            temp += "}";
            return temp;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}