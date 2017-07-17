using System;
using Model.Advertisements;
using WcfService.Messages;
using WcfService.Services;
using System.Web.UI;
using WcfService.IOC;
using System.Web.UI.WebControls;
using Model;


namespace WebUIMain.UserControls.NewAd
{
    public partial class NewAdAttributeTransportation : UserControl, INewAdOperations
    {
        public IAdvertisementTransportationService service = Bootstrapper.container.GetInstance<IAdvertisementTransportationService>();
        public AdvertisementTransportation AdvertisementTransportation = new AdvertisementTransportation();

        public AdvertisementCommon GetAdvertisementCommon()
        {
            return AdvertisementTransportation.AdvertisementCommon;
        }

        public ResponseBase SaveAdvertisement()
        {
            RegistrationService registrationService=new RegistrationService();
            ResponseBase<Customer> response= registrationService.GetUserInfromation();
            if (response.Success)
            {
                return service.AddNewAdvertisementTransportation
                    (AdvertisementTransportation,response.ResponseData.EmailAddress,response.ResponseData.Password,false);
            }
            else
            {
                ResponseBase responseBase =new ResponseBase();
                responseBase.SetFailureResponse(response.Message,response.ErrorCode);
                return responseBase;
            }
        }

        public void FillAdvertisementCustomAttributesFromUserInput()
        {
            fillBodyColor();
            fillBodyStatus();
            fillFuel();
            fillMileage();
            fillInternalColor();
            fillMakeYear();
            fillBrand();
            fillModel();
            fillGearBox();
            fillCarStatus();
            fillPlateType();
            
            //TODO move these methods to AdvertisementCommon class
            AdvertisementTransportation.AdvertisementCommon.AdvertisementPrice.price = decimal.Parse(TextBoxPriceCash.Text);
            AdvertisementTransportation.AdvertisementCommon.AdvertisementPrice.PriceType = PriceType.ForSale;
        }

        private void fillBrand()
        {
            if (DropDownListBrand.SelectedValue != null)
            {
                AdvertisementTransportation.BrandName = DropDownListBrand.SelectedItem.Text;
                int brandId;
                AdvertisementTransportation.BrandId =
                    int.TryParse(DropDownListBrand.SelectedValue, out brandId) ? brandId : -1;
            }
        }
        private void fillModel()
        {
            if (DropDownListModel.SelectedValue != null)
            {
                AdvertisementTransportation.ModelName = DropDownListModel.SelectedItem.Text;
                int tempModelId;
                AdvertisementTransportation.ModelId =
                    int.TryParse(DropDownListModel.SelectedValue, out tempModelId) ? tempModelId : -1;
            }
        }

        public int SelectedBrandId
        {
            get
            {
                if (DropDownListBrand.SelectedValue != null)
                {
                    int rtn;
                    int.TryParse(DropDownListBrand.SelectedValue, out rtn);
                    return rtn;
                }
                return -1;
            }
        }
        
        private void fillGearBox()
        {
            AdvertisementTransportation.Gearbox = RadioButtonManual.Checked ? "دنده ای" : "اتوماتیک";
        }

        private void fillMakeYear()
        {
            AdvertisementTransportation.MakeYear = int.Parse(DropDownListMakeYear.SelectedValue);
        }

        private void fillInternalColor()
        {
            AdvertisementTransportation.InternalColor = DropDownListInternalColor.SelectedItem.Text;
        }

        private void fillMileage()
        {
            int mileage;
            AdvertisementTransportation.Mileage = int.TryParse(TextBoxMileage.Text, out mileage) ? mileage : 0;
        }

        private void fillFuel()
        {
            AdvertisementTransportation.FuelName = DropDownListFuel.SelectedItem.Text;
        }

        private void fillBodyStatus()
        {
            AdvertisementTransportation.BodyStatusName = DropDownListBodyStatus.SelectedItem.Text;
        }

        private void fillBodyColor()
        {
            AdvertisementTransportation.BodyColor = DropDownListBodyColor.SelectedItem.Text;
        }
        
        private void fillPlateType()
        {
            if (RadioButtonNationalPlate.Checked)
                AdvertisementTransportation.PlateType = PlateType.National;
            else if (RadioButtonFreeRegionPlate.Checked)
                AdvertisementTransportation.PlateType = PlateType.FreeRegion;
            else if (RadioButtonTemporaryPlate.Checked)
                AdvertisementTransportation.PlateType = PlateType.Temporary;
        }

        private void fillCarStatus()
        {
            if (RadioButtonUsed.Checked)
                AdvertisementTransportation.CarStatus = CarStatus.Used;
            else if (RadioButtonNew.Checked)
                AdvertisementTransportation.CarStatus = CarStatus.New;
            else
                AdvertisementTransportation.CarStatus = CarStatus.Draft;
        }



        public void GetAdDetailFromRepositoryAndSetFields(Guid adId)
        {
            //TODO get adDetailFrom Service Layer and set fields
            ResponseBase<AdvertisementTransportation> response = service.GetAdvertisementTransportation(adId);
            if (response.Success)
            {
                setBrand(response.ResponseData.BrandName);
                setModel(response.ResponseData.ModelName);
                setMakeYear(response.ResponseData.MakeYear);
                setFuel(response.ResponseData.FuelName);
                setMilage(response.ResponseData.Mileage);
                setAdStatus(response.ResponseData.CarStatus);
                setPlateType(response.ResponseData.PlateType);
            }
        }

        private void setPlateType(PlateType plateType)
        {
            switch (plateType)
            {
                case PlateType.National:
                    RadioButtonNationalPlate.Checked = true;
                    break;
                case PlateType.FreeRegion:
                    RadioButtonFreeRegionPlate.Checked = true;
                    break;
                case PlateType.Temporary:
                    RadioButtonTemporaryPlate.Checked = true;
                    break;
            }
        }

        private void setAdStatus(CarStatus carStatus)
        {
            switch (carStatus)
            {
                case CarStatus.Used:
                    RadioButtonUsed.Checked = true;
                    break;
                case CarStatus.New:
                    RadioButtonNew.Checked = true;
                    break;
                case CarStatus.Draft:
                    RadioButtonDraft.Checked = true;
                    break;
            }
        }

        private void setMilage(int mileage)
        {
            TextBoxMileage.Text = mileage.ToString();
        }

        private void setFuel(string fuelName)
        {
            ListItem tempItem = DropDownListFuel.Items.FindByText(fuelName);
            if (tempItem != null)
                tempItem.Selected = true;
        }

        private void setMakeYear(int makeYear)
        {
            ListItem tempItem = DropDownListMakeYear.Items.FindByText(makeYear.ToString());
            if (tempItem != null)
                tempItem.Selected = true;
        }

        private void setBrand(string brandName)
        {
            DropDownListBrand.DataBind();
            ListItem tempItem = DropDownListBrand.Items.FindByText(brandName);
            if (tempItem != null)
                tempItem.Selected = true;
        }

        private void setModel(string modelName)
        {
            DropDownListModel.DataBind();
            ListItem tempItem = DropDownListModel.Items.FindByText(modelName);
            if (tempItem != null)
                tempItem.Selected = true;
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {

        }
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!Page.ClientScript.IsClientScriptBlockRegistered("adTran1"))
            //{
            //    string script1 = "$(document).ready(function(){alert('Tran1');});";
            //    Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "adTran1", script1, true);
            //}
            //string script2 = "$(document).ready(function(){alert('Tran2');});";
            //ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "adTran2", script2, true);

            //ScriptManager.RegisterClientScriptInclude(this, this.GetType(), "adTran3", ResolveClientUrl("~/StyleScript/NewAdTransportation.js"));

            //string script4 = "$(document).ready(function(){alert('Tran4');});";
            //ScriptManager.RegisterStartupScript(this, this.GetType(), "adTran4", script4, true);
        }

        protected void RadioButtonUsed_CheckedChanged(object sender, EventArgs e)
        {
            TextBoxMileage.Enabled = RadioButtonUsed.Checked;
        }

        protected void RadioButtonInsatllment_CheckedChanged(object sender, EventArgs e)
        {
            if (RadioButtonCash.Checked)
            {
                TextBoxPriceCash.Enabled = true;
                TextBoxTotalInstallments.Enabled = false;
                TextBoxDistanceBetweenPerPayment.Enabled = false;
                TextBoxPayPerInstallment.Enabled = false;
            }
            else
            {
                TextBoxPriceCash.Enabled = false;
                TextBoxTotalInstallments.Enabled = true;
                TextBoxDistanceBetweenPerPayment.Enabled = true;
                TextBoxPayPerInstallment.Enabled = true;
            }
        }

        protected void DropDownListBrand_SelectedIndexChanged(object sender, EventArgs e)
        {
            DropDownListModel.DataBind();
        }
    }
}