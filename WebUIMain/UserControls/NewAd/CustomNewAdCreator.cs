using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace WebUIMain.UserControls.NewAd
{
    public class CustomNewAdCreator:UserControl
    {

        //Decide which control to return based on categoryId 
        //Insert new add attributes
        public UserControl GetCustomControl(int categoryId)
        {
            UserControl tempControl = null;
            //TODO make it polymorphic
            if (categoryId == 100)
            {
                tempControl = AddAttributeTransportation();
            }
            else
            {

            }
            return tempControl;
        }

        private UserControl AddAttributeTransportation()
        {
            return (NewAdAttributeTransportation)LoadControl("~/UserControls/NewAd/NewAdTransportationControl.ascx");
        }


    }
}