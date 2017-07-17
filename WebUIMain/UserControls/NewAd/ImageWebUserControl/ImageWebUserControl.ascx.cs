using Model.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WcfService.IOC;

namespace WebUIMain.UserControls.NewAd.ImageWebUserControl
{



    public partial class ImageWebUserControl : System.Web.UI.UserControl
    {

        //int maxImageNumber = ServiceLocator.Locate<IImageRepository>("IImageRepository").MaximumNumberOfImagesPerAdvertisement();
        int maxImageNumber = Bootstrapper.container.GetInstance<IImageRepository>().MaximumNumberOfImagesPerAdvertisement();
        public string imageWebUserControlHandlerAddress = "~/UserControls/NewAd/ImageWebUserControl/ImageWebUserControlHandler.ashx";//address of handler file
                                                         
        
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void RemoveImagesFromSession()
        {
            for (int i = 1; i <= maxImageNumber; i++)
            {
                string ID = "image" + i.ToString();
                Session[ID] = null;
            }
        }

        public void FillImagesFromSession(string[] images)
        {
            for (int i = 1, j = 1; i < images.Length; i += 2, j++)
            {
                string ID = "image" + j.ToString();
                if (Session[ID] != null)
                {
                    images[i - 1] = (Session[ID] as string[])[0];
                    images[i] = (Session[ID] as string[])[1];
                }
            }
        }       
    }
}