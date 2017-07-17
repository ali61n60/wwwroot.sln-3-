using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUIMain.Advertisement
{
    public partial class Advertisement : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["message"] != null)
            {
                LabelMessage.Text = Request.QueryString["message"];
            }
        }
    }
}





