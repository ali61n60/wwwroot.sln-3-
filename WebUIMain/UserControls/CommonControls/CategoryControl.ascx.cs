using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Model.Advertisements;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.UserControls.CommonControls
{
    public partial class CategoryControl : System.Web.UI.UserControl
    {

        public string categoryHandlerAddress = "~/UserControls/CommonControls/CategoryHandler.ashx";//address of handler file
       
        protected void Page_Load(object sender, EventArgs e)
        {            
            
        }
    }
}