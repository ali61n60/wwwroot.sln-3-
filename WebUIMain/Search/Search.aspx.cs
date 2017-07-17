using System;
//
using WebUIMain.UserControls.SearchCritetria;


namespace WebUIMain.Search
{
    public partial class Search : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void CategorySelector_OnSelectedCategoryChanged(object sender, EventArgs e)
        {
            addCustomSearchControl(CategorySelector.SelectedCategoryId);
        }

        private void addCustomSearchControl(int categoryId)
        {
            PlaceHolderSearchCriteria.Controls.Clear();
            searchCriteriaControl.TextBoxCategoryId.Text = categoryId.ToString();
            switch (categoryId)
            {
                case 100:
                    SearchCriteriaAdTransportationControl searchCriteriaAdTransportation =
                        (SearchCriteriaAdTransportationControl)LoadControl("~/UserControls/SearchCritetria/SearchCriteriaAdTransportationControl.ascx");
                    searchCriteriaAdTransportation.ID = "searchCriteriaControl";
                    PlaceHolderSearchCriteria.Controls.Add(searchCriteriaAdTransportation);
                    
                    break;
            }
        }

    }
}









