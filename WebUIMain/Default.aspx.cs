using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

namespace WebUIMain
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Redirect("~/Search/Search.aspx", true);
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            if (Membership.GetUser() != null)
            {
                string opl = Membership.GetUser().UserName;
               
                RoleProviderCollection myRoles = Roles.Providers;
                foreach (RoleProvider role in myRoles)
                {
                    opl += ", " + role.Name;
                }
                Label2.Text = opl;
            }

        }
    }
}



