using Model.Advertisements;
using Repository.QueryPattern;
using Repository.QueryPattern.BaseQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.Search
{
    public partial class AjaxTest2 : System.Web.UI.Page
    {
        [WebMethod]
        [ScriptMethod]
        public static string GetDate()
        {
            return DateTime.Now.ToString();
        }
        public static string createStringFromAddCommon(AdvertisementCommon[] adds)
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
                temp += "\""+ "../Search/AdDetail/AdDetail.aspx?adId=" +
                    adds[i].AdvertisementId.ToString()+"&categoryId="+adds[i].AdvertisementCategoryId.ToString() + "\",";

                temp += "\"image\":";
                temp += "\"" + "data:image/jpg;base64," +adds[i].AdvertisementImages[0] +"\",";

                temp += "\"adStatus\":";
                temp+="\""+adds[i].AdvertisementStatus+"\",";

                temp += "\"date\":";
                temp += "\"" + adds[i].AdvertisementTime.ToShortDateString() + "\",";

                temp += "\"price\":";
                temp += "\"" + adds[i].AdvertisementPrice.price.ToString()+" , "+
                    adds[i].AdvertisementPrice.GetStringPriceType() +"\",";

                temp += "\"hrefText\":";
                temp += "\"" + adds[i].AdvertisementTitle + "\"";

                temp += "},";
            }
            temp = temp.Substring(0, temp.Length - 1);
            temp += "]";
            return temp;


            //return "[{\"name\":\"John Johnson\",\"street\":\"Oslo West 16\",\"phone\":\"555 1234567\"}," +
            //      "{\"name\":\"Ali Nejati\",\"street\":\"Poonak\",\"phone\":\"09122012908\"}]";
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }


        [WebMethod]
        //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string HelloWorld22()
        {
            return "Hello World from ali at 1395/03/23";
        }
    }
}