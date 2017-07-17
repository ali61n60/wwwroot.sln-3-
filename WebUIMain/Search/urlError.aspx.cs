using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUIMain.Search
{
    public partial class urlError : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string message = Request.QueryString["message"];
            if (message != null)
            {
                LabelResult.Text = message;
            }
            else
            {
                LabelResult.Text = "Error";
            }
        }
    }
}