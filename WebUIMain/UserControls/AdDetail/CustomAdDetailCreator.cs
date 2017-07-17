using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using WebUIMain.UserControls.NewAd;

namespace WebUIMain.UserControls.AdDetail
{
    public class CustomAdDetailCreator : UserControl
    {
        public Control GetCustomControl(int categoryId)
        {
            Control tempControl = null;
            if (categoryId == 100)
            {
                return (AdDetailTransportationControl)LoadControl("~/UserControls/AdDetail/AdDetailTransportationControl.ascx");
            }
            
            return tempControl;
        }

        
    }
}









