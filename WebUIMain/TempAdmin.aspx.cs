using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUIMain
{
    public partial class TempAdmin : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            Roles.CreateRole("admin1");
            Roles.AddUserToRole("ali62n62@yahoo.com","admin1");
        }
    }
}