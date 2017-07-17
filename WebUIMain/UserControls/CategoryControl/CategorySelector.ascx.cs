using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Model.Advertisements;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.UserControls.CategoryControl
{
    public partial class CategorySelector : System.Web.UI.UserControl
    {
        private Category[] allCategories = null;

        public int SelectedCategoryId;

       

        protected void Page_Load(object sender, EventArgs e)
        {
            fillAllCategories();
            SelectedCategoryId = 0;
            if (ViewState["SelectedCategoryId"] != null)
            {
                 SelectedCategoryId =  int.Parse(ViewState["SelectedCategoryId"].ToString());
            }

            if (allCategories != null)
            {
                showCategories();
            }
        }

        private void fillAllCategories()
        {
            if (allCategories == null)//not filled before
            {
                CategoryService categoryService = new CategoryService();
                ResponseBase<Category[]> categoryResponse = categoryService.GetAllCategories();
                if (categoryResponse.Success)
                {
                    allCategories = categoryResponse.ResponseData;
                }
                else
                {
                    allCategories = null;
                    LabelMessage.Text = "خطا در دریافت لیست گروه ها";
                }
            }

        }

        private void showCategories()
        {
            PlaceHolderCategories.Controls.Clear();
            string[] Styles=new string[5];
            Styles[0] = "btn btn-block btn-danger";
            Styles[1] = "btn btn-block btn-info";
            Styles[2] = "btn btn-block btn-success";
            Styles[3] = "btn btn-block btn-warning";
            Styles[4] = "btn btn-block btn-primary";

            FontUnit[] fontUnit = new FontUnit[5];
            fontUnit[0] = FontUnit.XLarge;
            fontUnit[1] = FontUnit.Larger;
            fontUnit[2] = FontUnit.Large;
            fontUnit[3] = FontUnit.Medium;
            fontUnit[4] = FontUnit.Small;
            int styleIndex = 0;
            
            Category temCategory;
            //add root
            addSingleCategoryItem(0, "تمام آگهی ها", Styles[styleIndex], fontUnit[styleIndex++]);
            //add grandparent
            if ((temCategory = findGrandParentCategory(SelectedCategoryId)) != null)
            {
                addSingleCategoryItem(temCategory.CategoryId, temCategory.CategoryName, Styles[styleIndex], fontUnit[styleIndex++]);
            }
            //add parent
            if ((temCategory = findParentCategory(SelectedCategoryId)) != null)
            {
                addSingleCategoryItem(temCategory.CategoryId, temCategory.CategoryName, Styles[styleIndex], fontUnit[styleIndex++]);
            }
            //add category
            if ((temCategory = findCategory(SelectedCategoryId)) != null)
            {
                addSingleCategoryItem(temCategory.CategoryId, temCategory.CategoryName, Styles[styleIndex], fontUnit[styleIndex++]);
            }

            //add children
            foreach (Category category in allCategories)
            {
                if (category.ParentCategoryId == SelectedCategoryId)
                {
                    addSingleCategoryItem(category.CategoryId, category.CategoryName, Styles[styleIndex], fontUnit[styleIndex]);
                }
            }
            Category selectedCategory = findCategory(SelectedCategoryId);
            string selectedCategoryName = selectedCategory != null ? selectedCategory.CategoryName : "تمام آگهی ها";
            LabelMessage.Text = selectedCategoryName;
        }

        private Category findGrandParentCategory(int categoryId)
        {
            Category temCategory = null;
            Category tempParentCategory = null;
            Category tempGrandParentCategory = null;

            temCategory = findCategory(categoryId);
            if (temCategory == null)
            {
                return null;
            }
            tempParentCategory = findCategory(temCategory.ParentCategoryId);
            if (tempParentCategory == null)
            {
                return null;
            }
            tempGrandParentCategory = findCategory(tempParentCategory.ParentCategoryId);

            return tempGrandParentCategory;
        }

        private Category findParentCategory(int categoryId)
        {
            Category temCategory = null;
            Category tempParentCategory = null;

            temCategory = findCategory(categoryId);
            if (temCategory == null)
            {
                return null;
            }
            tempParentCategory = findCategory(temCategory.ParentCategoryId);
            return tempParentCategory;
        }

        private Category findCategory(int categoryId)
        {
            Category temCategory = null;
            foreach (Category category in allCategories)
            {
                if (category.CategoryId == categoryId)
                {
                    temCategory = category;
                    return temCategory;
                }
            }

            return temCategory;
        }




        private void addSingleCategoryItem(int categoryId, string categoryName, string css,FontUnit fontUnit)
        {
            SingleCategoryItem singleCategoryItem =
                      (SingleCategoryItem)LoadControl("~/UserControls/CategoryControl/SingleCategoryItem.ascx");
            singleCategoryItem.CategoryId = categoryId;
            singleCategoryItem.Text = categoryName;
            singleCategoryItem.ID = "singleCategory" + categoryId;
            singleCategoryItem.SingleCategoryItemClick += singleCategoryItem_SingleCategoryItemClick;
            singleCategoryItem.ControlCSSClass = css;
            singleCategoryItem.fontUnit = fontUnit;
            
            PlaceHolderCategories.Controls.Add(singleCategoryItem);
        }

        void singleCategoryItem_SingleCategoryItemClick(object sender, EventArgs e)
        {
            int newSelectedCategoryId;
            SingleCategoryItem singleCategoryItem = (SingleCategoryItem)sender;
            newSelectedCategoryId = singleCategoryItem.CategoryId;

            

            if (newSelectedCategoryId != SelectedCategoryId)
            {
                SelectedCategoryId = newSelectedCategoryId;
                OnSelectedCategoryChanged(new EventArgs());
            }
            SelectedCategoryId = newSelectedCategoryId;
            ViewState["SelectedCategoryId"] = SelectedCategoryId;
            LabelMessage.Text = "selected category= " + SelectedCategoryId.ToString();
            showCategories();
        }

        public event EventHandler SelectedCategoryChanged;

        public void OnSelectedCategoryChanged(EventArgs e)
        {
            if (SelectedCategoryChanged != null)
            {
                SelectedCategoryChanged(this, e);
            }
        }


    }
}