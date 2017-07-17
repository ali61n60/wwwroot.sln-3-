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
    public partial class CategorySelectControl : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            initalize();
        }

        private void initalize()
        {
            CategoryService categoryService = new CategoryService();
            
            int ParentCategoryId = 0;
            ResponseBase<Category[]> response = categoryService.GetChildrenCategories(ParentCategoryId);
            foreach (Category category in response.ResponseData)
            {

            }
        }

        protected void ButtonExpand1_Click(object sender, EventArgs e)
        {

        }
    }
}