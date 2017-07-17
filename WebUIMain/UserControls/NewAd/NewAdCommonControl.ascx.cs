using System;
using System.Web.Security;
using System.Web.UI;
using Model.Advertisements;
using WcfService.Messages;
using WcfService.Services;

namespace WebUIMain.UserControls.NewAd
{
    public partial class NewAdCommonUserControl : UserControl
    {
        public ImageWebUserControl.ImageWebUserControl currentImageWebUserControl;

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (Session["customAttribute"] != null && Session["selectedCategoryId"] != null)
            {
                CustomNewAdCreator attrbuteCreator = new CustomNewAdCreator();
                int selectedCategoryId = (int)Session["selectedCategoryId"];
                Control tempControl = attrbuteCreator.GetCustomControl(selectedCategoryId);
                if (tempControl != null)
                {
                    tempControl.ID = "customAttribute";
                    PlaceHolderCustomAttribute.Controls.Add(tempControl);
                }
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            currentImageWebUserControl = ImageWebUserControl1;
            //if (!Page.ClientScript.IsClientScriptBlockRegistered("adCommon1"))
            //{
            //    string script1 = "$(document).ready(function(){alert('Common1');});";
            //    Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "adCommn1", script1, true);
            //}
            //string script2 = "$(document).ready(function(){alert('Common2');});";
            //ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "adCommon2", script2, true);     
        }

       
        private int SelectedCategoryId
        {
            get
            {
                object count = ViewState["SelectedCategoryId"];
                return (count == null) ? 0 : (int)count;
            }
            set { ViewState["SelectedCategoryId"] = value; }
        }

        protected void ButtonSubmitAd_Click(object sender, EventArgs e)
        {
            
            //this function is called to grab user input and store the Ad in database and may be file system
            ResponseBase responesBase = InsertNewAd();
            if (responesBase.Success)
            {
                ImageWebUserControl1.RemoveImagesFromSession();
                Response.Redirect("~/Advertisement/Advertisement.aspx?message=" +
                    "با تشکر از ارسال آگهی جدید، آگهی شما با موفقیت دریافت شد. پس از بررسی برروی سایت قرار خواهد گرفت", true);
            }
            else
            {
                LabelErrorMessage.Text = responesBase.Message;
            }
        }

        private ResponseBase InsertNewAd()
        {
            string errorCode = "NewAdCommonUserControl.InsertNewAd";
            INewAdOperations customAttribute;
            ResponseBase responseBase = new ResponseBase();

            ICategoryService categoryService = new CategoryService();
            SelectedCategoryId = 100;
            //int parentCategoryId = categoryService.GetParentCategory(SelectedCategoryId).ResponseData.CategoryId;
            //parentCategoryId = categoryService.GetParentCategory(parentCategoryId).ResponseData.CategoryId;

            if (PlaceHolderCustomAttribute.Controls.Count > 0)
            {
                customAttribute = (INewAdOperations)PlaceHolderCustomAttribute.Controls[0];
                if (customAttribute != null)
                {
                    customAttribute.FillAdvertisementCustomAttributesFromUserInput();
                    fillCommonAttributesFromUserInput(customAttribute.GetAdvertisementCommon());
                }
            }
            else
            {
                responseBase.SetFailureResponse("خطا در بارگزاری فرم", errorCode);
                return responseBase;
            }

            if (Membership.GetUser().ProviderUserKey == null)//user is not logged in
            {
                Response.Redirect("~/Search/urlError.aspx?message=" + "برای درج آگهی ابتدا وارد حساب کاربری خود شوید", true);
            }
            else// insert new add in the database
            {
                responseBase = customAttribute.SaveAdvertisement();
            }
            return responseBase;
        }

        private void fillCommonAttributesFromUserInput(AdvertisementCommon advertisementCommon)
        {
            //grab images and other attributes
            
            advertisementCommon.AdvertisementCategoryId = SelectedCategoryId;
            advertisementCommon.AdvertisementTime = DateTime.Now;
            advertisementCommon.DistrictId = 29;//شهرک غرب
            if (Membership.GetUser().ProviderUserKey != null)
            {
                advertisementCommon.UserId = (Guid)Membership.GetUser().ProviderUserKey;
            }
            advertisementCommon.AdvertisementTitle = TextBoxTitle.Text;
            advertisementCommon.AdvertisementComments = TextBoxComments.Text;
            advertisementCommon.AdPrivilageId = int.Parse(TextBoxAdPrivilageId.Text);//1=NoPrivilege,2=Urgent,3=EmailOthers,4=SMSOthers
            ImageWebUserControl1.FillImagesFromSession(advertisementCommon.AdvertisementImages);
        }



        protected void ButtonSelectedCategoryChanged_Click(object sender, EventArgs e)
        {
            PlaceHolderCustomAttribute.Controls.Clear();
            Label2.Text = DateTime.Now.ToString();
            Label3.Text = DateTime.Now.ToString() + " , message is:" + HiddenFieldSelectedCategoryChanged.Value;
            Label5.Text = DateTime.Now.ToString();
            int categoryId;
            //value in HiddenFieldSelectedCategoryChanged is int
            if (int.TryParse(HiddenFieldSelectedCategoryChanged.Value, out categoryId)) // grab categoryId from HiddenFieldSelectedCategoryChanged
            {
                Session["selectedCategoryId"] = categoryId;
                CustomNewAdCreator attrbuteCreator = new CustomNewAdCreator();
                Control tempControl = attrbuteCreator.GetCustomControl(categoryId);
                if (tempControl != null)
                {
                    tempControl.ID = "customAttribute";
                    PlaceHolderCustomAttribute.Controls.Add(tempControl);
                    Session["customAttribute"] = tempControl;

                }               
            }
            else// //value in HiddenFieldSelectedCategoryChanged is NOT int
            {
                //TODO report error in input categoryId
            }
        }
    }
}