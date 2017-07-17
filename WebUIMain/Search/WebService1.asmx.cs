using Model.Advertisements;
using Repository.QueryPattern;
using Repository.QueryPattern.BaseQuery;
using System;
using System.Web.Script.Services;
using System.Web.Services;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Search
{
    /// <summary>
    /// Summary description for WebService1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class WebService1 : System.Web.Services.WebService
    {

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World from ali at 1395/03/23";
        }


        [WebMethod]
        [ScriptMethod]
        public string GetDate()
        {
            return DateTime.Now.ToString();
        }

        public string createStringFromAddCommon(AdvertisementCommon[] adds)
        {
            string temp = "[";
            for (int i = 0; i < adds.Length; i++)
            {
                temp += "{";

                temp += "\"category\":";
                temp += "\"" + adds[i].AdvertisementCategory + "\",";

                temp += "\"title\":";
                temp += "\"" + adds[i].AdvertisementTitle + "\",";

                temp += "\"city\":";
                temp += "\"" + adds[i].CityName + "\",";

                temp += "\"href\":";
                temp += "\"" + "../Search/AdDetail/AdDetail.aspx?adId=" +
                    adds[i].AdvertisementId.ToString() + "&categoryId=" + adds[i].AdvertisementCategoryId.ToString() + "\",";

                temp += "\"image\":";
                temp += "\"" + "data:image/jpg;base64," + adds[i].AdvertisementImages[0] + "\",";

                temp += "\"adStatus\":";
                temp += "\"" + adds[i].AdvertisementStatus + "\",";

                temp += "\"date\":";
                temp += "\"" + adds[i].AdvertisementTime.ToShortDateString() + "\",";

                temp += "\"price\":";
                temp += "\"" + adds[i].AdvertisementPrice.price.ToString() + " , " +
                    adds[i].AdvertisementPrice.GetStringPriceType() + "\",";

                temp += "\"hrefText\":";
                temp += "\"" + adds[i].AdvertisementTitle + "\"";

                temp += "},";
            }
            temp = temp.Substring(0, temp.Length - 1);
            temp += "]";
            return temp;
        }       

    }


}
