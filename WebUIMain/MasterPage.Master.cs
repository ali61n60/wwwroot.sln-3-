using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Security;
using System.Threading;
using System.Globalization;
namespace WebUIMain
{
    public partial class MasterPage : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bool isLoggedIn = HttpContext.Current.User.Identity.IsAuthenticated;
            if (isLoggedIn)
            {
                LabelSayHello.Text = "Hello, " + HttpContext.Current.User.Identity.Name;
            }
            else
            {
                LabelSayHello.Text = "Hello, You must log in";
            }
        }
    }
}