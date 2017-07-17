using Model.Advertisements;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using WcfService.Services;

namespace WebUIMain.UserControls.NewAd.CategoryControl
{
    /// <summary>
    /// Summary description for CategoryHandler
    /// </summary>
    public class CategoryHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            try
            {
                string method = context.Request.Form.Get("method");
                if (method == "fillAllCategories")
                {
                    fillAllCategories(context);
                    return;
                }                   
            }
            catch (Exception)
            {
                string response = setReturnMessage("false", "در پردازش اطلاعات خطا رخ داده است" + " , WebUIMain.UserControls.NewAd.ProcessRequest");
                context.Response.Write(response);
            }
            return;
        }


        private void fillAllCategories(HttpContext context)
        {
            Category[] allCategories = getAllCategories();
            string response = setReturnMessage("true", allCategories);
            context.Response.Write(response);
            return;
        }

        

        private Category[] getAllCategories()
        {
            ICategoryService categoryService = new CategoryService();
            return categoryService.GetAllCategories().ResponseData;
        }

        private string setReturnMessage(string status, string message)
        {
            string temp = "{\"status\":\"" + status + "\"";
            temp += ",\"message\":\"" + message + "\"";
            temp += "}";
            return temp;
        }


        private string setReturnMessage(string status, Category[] allCategories)
        {
            string temp = "{\"status\":\"" + status + "\"";
            if (allCategories.Length >= 1)
            {
                temp += ",\"allCategories\":[";
                for (int i = 0; i < allCategories.Length; i++)
                {
                    temp += "{\"categoryId\":" + allCategories[i].CategoryId + " , ";
                    temp += "\"parentCategoryId\":" + allCategories[i].ParentCategoryId + " ,";
                    temp += "\"categoryName\":\"" + allCategories[i].CategoryName + "\" ,";
                    temp += "\"englishCategoryName\":\"" + allCategories[i].EnglishCategoryName + "\"";
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