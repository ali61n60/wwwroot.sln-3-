using System;
using System.Web.UI;
using Model.Advertisements;

namespace WebUIMain.UserControls.AdDetail
{
    public partial class AdDetailTransportationControl : UserControl, IAdDetailOperations
    {
        private IAdvertisementTransportationService service = new AdvertisementTransportationService();
        private AdvertisementCommon _advertisementCommon;
        
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public ResponseBase FillAdvertisementAttributesFromService(Guid advertisementId)
        {
            ResponseBase<AdvertisementTransportation> response = service.GetAdvertisementTransportation(advertisementId);
           
            if (response.Success)
            {
                fillControlsDataFromServiceResponse(response.ResponseData);
                _advertisementCommon = response.ResponseData.AdvertisementCommon;
            }
            return response.GetSimpleResponseBase();
        }

        public AdvertisementCommon GetAdvertisementCommon()
        {
            return _advertisementCommon;
        }

        private void fillControlsDataFromServiceResponse(AdvertisementTransportation AdvertisementTransportation)
        {
            LabelBrand.Text = AdvertisementTransportation.BrandName;
            LabelModel.Text = AdvertisementTransportation.ModelName;
            LabelGearBox.Text = AdvertisementTransportation.Gearbox;
            LabelBodyColor.Text = AdvertisementTransportation.BodyColor;
            LabelInsideColor.Text = AdvertisementTransportation.InternalColor;
            LabelMileage.Text = AdvertisementTransportation.Mileage.ToString();
            LabelMakeYear.Text = AdvertisementTransportation.MakeYear.ToString();
            LabelFuel.Text = AdvertisementTransportation.FuelName;
        }
    }
}




//private TransportationAttribute transportationAttribute = new TransportationAttribute();
//   private AdAttributes attribute;// = new AdAttributes(transportationAttribute);
//   protected void Page_Load(object sender, EventArgs e)
//   {
//       Guid adId;
//       //attribute = new AdAttributes(transportationAttribute);
//       if (!IsPostBack)
//       {
//           if(Request.QueryString["adId"]!=null)//if adId is not present
//           {

//               try//if adId is not in correct format
//               {
//                   adId=Guid.Parse(Request.QueryString["adId"]);
//                   try// if database error
//                   {
//                      // transportationAttribute = transportationAttribute.GetTransportationAttribute(adId);
//                   }
//                   catch (Exception exInner)
//                   {
//                       Response.Redirect("~/Search/urlError.aspx?message=" + "خطا در ارتباط با دیتا سنتر", true);
//                   }
//                   FillControlsData(adId);
//               }
//               catch(Exception ex)
//               {
//                   Response.Redirect("~/Search/urlError.aspx?message="+"خطا در فرمت اطلاعات ورودی",true);
//               }             
//           }
//           else
//           {
//               Response.Redirect("~/Search/urlError.aspx?message=" + "خطا در ورود اطلاعات", true);
//           }
//       }
//   }
//   private void FillControlsData(Guid adId)
//   {
//       ///TODO populate the page and show it
//       ///
//       //LabelAdTitle.Text = attribute.commonAttribute.AdTitle;
//       //LabelBrand.Text = attribute.BrandName;
//       //LabelModel.Text = attribute.ModelName;
//       //LabelMakeYear.Text = attribute.MakeYear.ToString();
//       //LabelPrice.Text = attribute.Price;
//       //LabelFuel.Text = attribute.Fuel;
//       //LabelInsideColor.Text = attribute.InternalColor;
//       //LabelBodyColor.Text = attribute.BodyColor;
//       //LabelMileage.Text = attribute.Mileage.ToString();
//       //LabelComments.Text = attribute.commonAttribute.AdComments;
//       //LabelPhoneNumber.Text = attribute.commonAttribute.PhoneNumber;
//       //LabelEmail.Text = attribute.commonAttribute.Email;

//       ////get ad images
//       //attribute.commonAttribute.FillAdImagesFromDatabase(adId);
//       //string carousel1 = "<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\">";
//       //string carousel2 = "<ol class=\"carousel-indicators\">";
//       //string carousel3 = "";
//       //string carousel4 = " </ol>";
//       //string carousel5 = "<div class=\"carousel-inner\" role=\"listbox\">";
//       //string carousel6 = "";
//       //string carousel7 = " </div>";
//       //string carousel8 = "<a class=\"left carousel-control\" href=\"#myCarousel\" role=\"button\" data-slide=\"prev\"> " +
//       //"<span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>" +
//       //"<span class=\"sr-only\">Previous</span> </a>" +
//       //"<a class=\"right carousel-control\" href=\"#myCarousel\" role=\"button\" data-slide=\"next\">" +
//       //"<span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>" +
//       //"<span class=\"sr-only\">Next</span> </a> </div>";
//       //for (int i = 0; i < attribute.commonAttribute.images.Length; i += 2)
//       //{
//       //    int j = (int)(i / 2);
//       //    if (attribute.commonAttribute.images[i] != null)
//       //    {
//       //        if (carousel3 == "")//active
//       //        {
//       //            carousel3 += "<li data-target=\"#myCarousel\" data-slide-to=\"" + j.ToString() + "\" class=\"active\"></li>";
//       //        }
//       //        else
//       //        {
//       //            carousel3 += "<li data-target=\"#myCarousel\" data-slide-to=\"" + j.ToString() + "\" ></li>";
//       //        }
//       //        if (carousel6 == "")//activr
//       //        {
//       //            carousel6 += "<div class=\"item active \"> <img src=\"" + attribute.commonAttribute.images[i + 1] + "\"  alt=\"Chania\" width=\"600\" height=\"450\"/> " +
//       //                 "</div>";

//       //        }
//       //        else
//       //        {
//       //            carousel6 += "<div class=\"item\"> <img src=\"" + attribute.commonAttribute.images[i + 1] + "\"  alt=\"Chania\" width=\"600\" height=\"450\"/> " +
//       //            "</div>";
//       //        }
//       //    }
//       //}
//       //string carousel= carousel1 + carousel2 + carousel3 + carousel4 + carousel5 + carousel6 + carousel7 + carousel8;
//       //PlaceHolder1.Controls.AddCriterias(new LiteralControl(carousel));      
//   }   