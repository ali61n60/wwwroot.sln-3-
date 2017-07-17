using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Model.Advertisements;
using Model.ServiceLibrary;
using Repository.Messages;

namespace Repository
{
    public class SmsRepository
    {
        private readonly string _conectionString;

        public SmsRepository()
            : this(AdvertisementDataClass.GetConnectionString()) { }


        public SmsRepository(string connectionString)
        {
            _conectionString = connectionString;
        }

        public SmsMessage GetSmsMessageFromDatabase()
        {
            SmsMessage sms = new SmsMessage();
            string commandText = " SELECT top 1  messageId,[message],phoneNumber,messageDate,[sent] " +
                                 " FROM SMS WHERE [sent]=0 ORDER BY messageDate Asc ";
            SqlDataReader dataReader;
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.CommandText = commandText;
                    command.Connection = connection;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);

                        if (dataReader.Read())
                        {
                            sms.Message = (string)dataReader["message"];
                            sms.PhoneNumber = (string)dataReader["phoneNumber"];
                            sms.MessageDate = (DateTime)dataReader["messageDate"];
                            sms.MessageGuid = (Guid)dataReader["messageId"];
                            sms.Sent = (bool)dataReader["sent"];
                            dataReader.Close();
                        }
                        else
                        {
                            sms = null;
                        }
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }
            return sms;
        }

        public RepositoryResponseBase SetSmsMessageAsSent(SmsMessage sms)
        {
            RepositoryResponseBase response = new RepositoryResponseBase();
            int rowsAffected;
            SqlConnection connection = new SqlConnection(_conectionString);
            string commandText = "UPDATE SMS SET [sent]='true' WHERE messageId=@messageId ";
            SqlCommand command = new SqlCommand(commandText,connection);
            command.Parameters.Add("@messageId", System.Data.SqlDbType.UniqueIdentifier).Value = sms.MessageGuid;
            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();
                response.Message = "OK";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }
            finally
            {
                connection.Close();
            }
            return response;
        }

        public RepositoryResponseBase PlaceNewSmsForSend(string message, string phoneNumber)
        {
            RepositoryResponseBase response = new RepositoryResponseBase();
            int rowsAffected;
            SqlConnection connection = new SqlConnection(_conectionString);
            string commandText = " INSERT INTO SMS (messageId,[message],phoneNumber,messageDate,[sent]) "+
                                 " VALUES (@messageId,@message,@phoneNumber,@messageDate,@hasSent) ";
            SqlCommand command = new SqlCommand(commandText,connection);
            command.Parameters.Add("@messageId", System.Data.SqlDbType.UniqueIdentifier).Value = Guid.NewGuid();
            command.Parameters.Add("@message", System.Data.SqlDbType.NVarChar).Value = message;
            command.Parameters.Add("@phoneNumber", System.Data.SqlDbType.NVarChar).Value = phoneNumber;
            command.Parameters.Add("@messageDate", System.Data.SqlDbType.DateTime).Value = DateTime.Now;
            command.Parameters.Add("@hasSent", System.Data.SqlDbType.Bit).Value = false;

            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();
                response.Message = "OK";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }
            finally
            {
                connection.Close();
            }
            return response;
        }
    }

}



