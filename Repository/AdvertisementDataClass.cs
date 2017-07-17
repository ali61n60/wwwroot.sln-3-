using System;
using System.Data.SqlClient;

//
//using System.Web.UI;

namespace Repository
{
    public class AdvertisementDataClass
    {
        public static string GetConnectionString()
        {
           return System.Configuration.ConfigurationManager.
                ConnectionStrings["petropas_dbConnectionString"].ConnectionString;
        }


       
       
        //Move
        /// <summary>
        /// calculate time passed and return appropriate string
        /// </summary>
        /// <param name="adTime"></param>
        /// <returns></returns>
        private static string SetAdTimeText(DateTime adTime)
        {

            string returnString = "";
            // currentTime = currentTime.AddYears(10);

            TimeSpan timeDiff = DateTime.Now.Subtract(adTime);
            if (timeDiff.Days >= 365)//greater than 1 year
            {
                int hours = timeDiff.Hours;
                int days = timeDiff.Days;
                int year = (int)(timeDiff.Days / 365);
                days = days - year * 365;
                returnString = "زمان آگهی " + year.ToString() + " سال , " + days.ToString() + " " + " روز پیش ";
            }
            else if (timeDiff.Days >= 1)//greater than 1 day
            {
                int hours = timeDiff.Hours;
                int days = timeDiff.Days;
                returnString = "زمان آگهی " + days.ToString() + " " + " روز پیش ";
            }
            else if (timeDiff.Hours >= 1)//greater than 1 hour
            {
                int hours = timeDiff.Hours;
                returnString = "زمان آگهی " + hours.ToString() + " " + " ساعت پیش ";
            }
            else if (timeDiff.Minutes >= 30)//greater than 30 minutes
            {
                returnString = "کمتر از یک ساعت پیش";
            }
            else if (timeDiff.Minutes >= 15)//greater than 15 minutes
            {
                returnString = "کمتر از نیم ساعت پیش";
            }
            else//less than 15 minutes
            {
                returnString = "کمتر از یک ربع پیش";
            }
            return returnString;
        }


       

        public static string[] getPhoneMailDate(Guid adId)
        {
            SqlDataReader dataReader = null;
            string conectionString = System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"].ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);

            SqlCommand command = new SqlCommand("SELECT  Advertisements.adInsertDateTime, UsersExtraInfo.emailAddress, UsersExtraInfo.phoneNumber " +
                                      "FROM Advertisements INNER JOIN aspnet_Users ON Advertisements.UserId = aspnet_Users.UserId INNER JOIN " +
                                      "UsersExtraInfo ON aspnet_Users.UserId = UsersExtraInfo.UserId " +
                                      "WHERE Advertisements.adId=@adId  ", connection);
            command.Parameters.Add("@adId", System.Data.SqlDbType.UniqueIdentifier).Value = adId;
            string[] phoneMailDate = new string[3];
            phoneMailDate[0] = "";
            phoneMailDate[1] = "";
            phoneMailDate[2] = "";
            try
            {
                connection.Open();
                dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                while (dataReader.Read())
                {
                    phoneMailDate[0] = (string)dataReader["phoneNumber"];
                    phoneMailDate[1] = (string)dataReader["emailAddress"];
                    phoneMailDate[2] = ((DateTime)dataReader["adInsertDateTime"]).ToString();


                }
                dataReader.Close();
            }
            catch (Exception ex)
            {
                connection.Close();
            }
            return phoneMailDate;
        }

        public static int GetParentCategoryId(int categoryId)
        {
            // Random rand = new Random();
            // return rand.Next(1, 11);
            return 2;
        }

        
    }

}
