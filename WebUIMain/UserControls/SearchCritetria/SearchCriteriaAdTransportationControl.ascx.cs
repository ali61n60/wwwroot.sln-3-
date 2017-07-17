using System;
using System.Web.UI;

namespace WebUIMain.UserControls.SearchCritetria
{
    public partial class SearchCriteriaAdTransportationControl : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //TODO move in to .js file
            string script = @"
            <script >
                        $(document).ready(function () {
                            searchCriteriaUserControlLoaded();
                        });//end ready

            </script>";


            // Page.ClientScript.RegisterClientScriptBlock(GetType(),"transport",script,false);

            ScriptManager.RegisterClientScriptBlock(this, GetType(), "transport", script, false);
            ScriptManager.RegisterClientScriptInclude(this, GetType(), "searchCriteriaTrasportation", "/UserControls/SearchCritetria/searchCriteriaTrasportation.js");
        }


       

        

        public void SetCategoryId(int categoryId)
        {
            //this.CommonSearchCriteriaControl.CategoryId= categoryId;
        }
    }
}