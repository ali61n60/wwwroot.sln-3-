using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Model.Advertisements;
using Repository;
using Repository.Messages;
using WebUIMain.UserControls.VerifyAd;

namespace WebUIMain.Manager.ManageAdvertisements
{
    public partial class VerifyAdvertisements : System.Web.UI.Page
    {
       
        public global::System.Web.UI.WebControls.Label LabelMessage;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["message"] != null)
            {
                LabelMessage.Text = Request.QueryString["message"] + "\n";
            }
            else
            {
                LabelMessage.Text = "";
            }
             string commandText = " SELECT  Advertisements.adId, Advertisements.UserId, Advertisements.categoryId, " +
             " Advertisements.districtId, Advertisements.adInsertDateTime, Advertisements.adStatusId, " +
             " Advertisements.adTitle, Advertisements.adComments, Advertisements.adNumberOfVisited, " +
             " Price.price , Price.PriceType,  " +
             " aspnet_Users.emailAddress, aspnet_Users.phoneNumber, " +
             " Cities.cityName, Categories.categoryName, Districts.districtName, Provinces.provinceName, AdStatus.adStatus " +
             " FROM  Advertisements LEFT JOIN " +
             " Price ON  Advertisements.adId=Price.adId  INNER JOIN " +
             " aspnet_Users ON Advertisements.UserId = aspnet_Users.UserId INNER JOIN " +
             " Categories ON Advertisements.categoryId = Categories.categoryId INNER JOIN " +
             " Districts ON Advertisements.districtId = Districts.districtId INNER JOIN " +
             " Cities ON Districts.cityId = Cities.cityId INNER JOIN " +
             " Provinces ON Cities.provinceId = Provinces.provinceId INNER JOIN " +
             " AdStatus ON Advertisements.adStatusId = AdStatus.adStatusId ";

            List<AdvertisementCommon> searchResultItems = new List<AdvertisementCommon>();
            AdvertisementCommon tempAdvertisementCommon;
            SqlDataReader dataReader = null;
            RepositoryResponse responseBase;


            using (SqlConnection connection = new SqlConnection(AdvertisementDataClass.GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    commandText += createWhereClauseFromUserInput() == ""
                        ? ""
                        : " WHERE " + createWhereClauseFromUserInput();
                    command.CommandText = commandText;
                    command.Connection = connection;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

                        while (dataReader.Read())
                        {
                            tempAdvertisementCommon = new AdvertisementCommon();
                            responseBase = fillAdvertisementCommonFromDataReader(tempAdvertisementCommon, dataReader);
                            if (!responseBase.Success)
                            {
                                throw new Exception(responseBase.Message);
                            }
                            searchResultItems.Add(tempAdvertisementCommon);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                    finally
                    {
                        if (dataReader != null)
                        {
                            dataReader.Close();
                        }
                    }
                }
            }


            if (searchResultItems.Count < 1)
            {
                ///TODO search result = EMPLY
            }
            else
            {
                VerifyAdControl[] userControl = CreateUserControlFromAdvertisementResponse(searchResultItems);
                DisplayAdvertisementsOnThePage(userControl);
            }

        }

      

        private VerifyAdControl[] CreateUserControlFromAdvertisementResponse(List<AdvertisementCommon> response)
        {
            VerifyAdControl[] userControls = new VerifyAdControl[response.Count];
            for (int i = 0; i < response.Count; i++)
            {
                userControls[i] = (VerifyAdControl)LoadControl("~/UserControls/VerifyAd/VerifyAdControl.ascx");
                userControls[i].SetAdvertisementCommon(response[i]);
            }
            return userControls;
        }

         private void DisplayAdvertisementsOnThePage(VerifyAdControl[] verifyAdControls)
        {
            foreach (VerifyAdControl t in verifyAdControls)
            {
                t.EnableViewState = true;
                PlaceHolderControls.Controls.Add(t);
            }
        }

      

      

            
        


        private RepositoryResponse fillAdvertisementCommonFromDataReader
           (AdvertisementCommon advertisementCommon, SqlDataReader dataReader)
        {
            RepositoryResponse responseBase = new RepositoryResponse();
            try
            {
                advertisementCommon.AdvertisementId = (Guid)dataReader["adId"];
                advertisementCommon.UserId = (Guid)dataReader["UserId"];
                advertisementCommon.AdvertisementCategoryId = (int)dataReader["categoryId"];
                advertisementCommon.DistrictId = (int)dataReader["districtId"];
                advertisementCommon.AdvertisementTime = (DateTime)dataReader["adInsertDateTime"];
                advertisementCommon.AdvertisementStatusId = (int)dataReader["adStatusId"];
                if (!(dataReader["adTitle"] is System.DBNull))
                {
                    advertisementCommon.AdvertisementTitle = (string)dataReader["adTitle"];
                }
                if (!(dataReader["adComments"] is System.DBNull))
                {
                    advertisementCommon.AdvertisementComments = (string)dataReader["adComments"];

                }
                if (!(dataReader["adNumberOfVisited"] is System.DBNull))
                {
                    advertisementCommon.NumberOfVisit = (int)dataReader["adNumberOfVisited"];
                }

                if (!(dataReader["emailAddress"] is DBNull))
                {
                    advertisementCommon.Email = (string)dataReader["emailAddress"];
                }
                if (!(dataReader["phoneNumber"] is DBNull))
                {
                    advertisementCommon.PhoneNumber = (string)dataReader["phoneNumber"];
                }
                advertisementCommon.CityName = (string)dataReader["cityName"];
                advertisementCommon.AdvertisementCategory = (string)dataReader["categoryName"];
                advertisementCommon.DistrictName = (string)dataReader["districtName"];
                advertisementCommon.ProvinceName = (string)dataReader["provinceName"];
                advertisementCommon.AdvertisementStatus = (string)dataReader["adStatus"];
                if (!(dataReader["price"] is DBNull))
                {
                    advertisementCommon.AdvertisementPrice.price = (decimal)dataReader["price"];
                }
                if (!(dataReader["priceType"] is DBNull))
                {
                    advertisementCommon.AdvertisementPrice.SetPriceTypeFromString((string)dataReader["priceType"]);
                }
                responseBase.Success = true;
                responseBase.Message = "OK";
            }
            catch (Exception ex)
            {
                responseBase.Success = false;
                responseBase.Message = ex.Message;

            }
            return responseBase;
        }


        private string createWhereClauseFromUserInput()
        {
            string temp = "";
            bool firstCheck = true;

            if (CheckBoxSubmitted1.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=1 " : " OR Advertisements.adStatusId=1 ";
                firstCheck = false;
            }
            if (CheckBoxUnderReview2.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=2 " : " OR Advertisements.adStatusId=2 ";
                firstCheck = false;
            }
            if (CheckBoxApproved3.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=3 " : " OR Advertisements.adStatusId=3 ";
                firstCheck = false;
            }
            if (CheckBoxRejected4.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=4 " : " OR Advertisements.adStatusId=4 ";
                firstCheck = false;
            }
            if (CheckBoxExpired5.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=5 " : " OR Advertisements.adStatusId=5 ";
                firstCheck = false;
            }
            if (CheckBoxReSubmitted6.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=6 " : " OR Advertisements.adStatusId=6 ";
                firstCheck = false;
            }
            if (CheckBoxDeleted7.Checked)
            {
                temp += firstCheck ? " Advertisements.adStatusId=7 " : " OR Advertisements.adStatusId=7 ";
                firstCheck = false;
            }
            return temp;
        }

        protected void ButtonSearch_Click(object sender, EventArgs e)
        {

        }
    }
}