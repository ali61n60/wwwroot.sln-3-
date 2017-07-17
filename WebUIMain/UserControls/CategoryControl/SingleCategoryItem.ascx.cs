using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUIMain.UserControls.CategoryControl
{
    public partial class SingleCategoryItem : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
        }        

        public string Text { get { return Button1.Text; } set { Button1.Text = value; } }

        public int CategoryId { get; set; }

        public event EventHandler SingleCategoryItemClick;

        protected void Button1_Click(object sender, EventArgs e)
        {
            if (SingleCategoryItemClick != null)
            {
                SingleCategoryItemClick(this, e);
            }
        }

        public string ControlCSSClass
        {
            get { return Button1.CssClass; }
            set { Button1.CssClass = value; }
        }

        public FontUnit fontUnit
        {
            get {return Button1.Font.Size; }
            set { Button1.Font.Size = value; }
        }
    }
}