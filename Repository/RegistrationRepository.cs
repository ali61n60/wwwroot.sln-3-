using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Model;
using Repository.Messages;

namespace Repository
{
    public class RegistrationRepository
    {
        private readonly string _conectionString;
         public RegistrationRepository(): this(AdvertisementDataClass.GetConnectionString()) { }

         public RegistrationRepository(string connectionString)
        {
            _conectionString = connectionString;
        }

        public RepositoryResponse AddExtraInformationIntoAspnet_Users(Guid UserId, string emailAddress, string phoneNumber,
                                                                      string emailVerificationCode, string phoneVerificationCode)
        {
            SqlDataReader dataReader = null;
            RepositoryResponse responseBase=new RepositoryResponse();
            responseBase.Customer = null;
                                  
            string commandText = " UPDATE aspnet_Users set "+ 
                                 " emailAddress=@emailAddress , "+
                                 " phoneNumber=@phoneNumber , " + 
                                 " emailAddressVerified=0 , " +
                                 " phoneNumberVerified=0 , " +
                                 " emailAddressVerifyCode=@emailVerificationCode, " +
                                 " phoneNumberVerifyCode=@phoneVerificationCode " +
                                 " WHERE UserId= @UserId ";

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@UserId", System.Data.SqlDbType.UniqueIdentifier).Value = UserId;
                    command.Parameters.Add("@emailAddress", System.Data.SqlDbType.NVarChar).Value = emailAddress;
                    command.Parameters.Add("@phoneNumber", System.Data.SqlDbType.NVarChar).Value = phoneNumber;
                    command.Parameters.Add("@emailVerificationCode", System.Data.SqlDbType.NVarChar).Value = emailVerificationCode;
                    command.Parameters.Add("@phoneVerificationCode", System.Data.SqlDbType.NVarChar).Value = phoneVerificationCode;

                    try
                    {
                        connection.Open();
                        int numberOfRowsAffected= command.ExecuteNonQuery();
                        if (numberOfRowsAffected>0)
                        {
                            responseBase.Success = true;
                            responseBase.Message = "OK";
                        }
                        else
                        {
                            responseBase.Success = false;
                            responseBase.Message = "Number of affected rows :"+ numberOfRowsAffected;
                        }
                    }
                    catch (Exception ex)
                    {
                        responseBase.Success = false;
                        responseBase.Message = ex.Message;
                    }
                   
                }
            }
            return responseBase;
        }

        public RepositoryResponse GetCustomerInfromation(string username)
        {
            SqlDataReader dataReader;
            RepositoryResponse responseBase = new RepositoryResponse();
            responseBase.Customer = null;

            string commandText = " SELECT aspnet_Users.UserName , aspnet_Membership.Password " +
                                 " FROM aspnet_Users INNER JOIN aspnet_Membership on " +
                                 " aspnet_Users.UserId=aspnet_Membership.UserId " +
                                 " WHERE aspnet_Users.UserName=@username";
            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@username", System.Data.SqlDbType.NVarChar).Value = username;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                        if (dataReader.Read())
                        {
                            responseBase.Customer = new Customer();
                            responseBase.Customer.EmailAddress = (string)dataReader["UserName"];
                            responseBase.Customer.Password = (string)dataReader["Password"];
                            responseBase.Success = true;
                            responseBase.Message = "OK";
                        }
                        else
                        {
                            responseBase.Success = false;
                            responseBase.Message = "ایمیل وارد شده یافت نشد";
                        }
                    }
                    catch (Exception ex)
                    {
                        responseBase.Success = false;
                        responseBase.Message = ex.Message;
                    }
                }
            }
            return responseBase;
        }

        public RepositoryResponse GetCustomerInfromation(Guid UserId)
        {
            SqlDataReader dataReader = null;
            RepositoryResponse responseBase = new RepositoryResponse();
            responseBase.Customer = null;

            string commandText = " SELECT emailAddress, phoneNumber, emailAddressVerified, phoneNumberVerified "+ 
                                 " FROM aspnet_Users " +
                                 " WHERE UserId= @UserId ";

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@UserId", System.Data.SqlDbType.UniqueIdentifier).Value = UserId;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                        if (dataReader.Read())
                        {
                            responseBase.Customer=new Customer();
                            responseBase.Customer.EmailAddress = (string) dataReader["emailAddress"];
                            responseBase.Customer.PhoneNumber = (string)dataReader["phoneNumber"];
                            responseBase.Customer.VerifiedEmailAddress = (bool)dataReader["emailAddressVerified"];
                            responseBase.Customer.VerifiedPhoneNumber = (bool)dataReader["phoneNumberVerified"];
                            responseBase.Success = true;
                            responseBase.Message = "OK";
                        }
                        else
                        {
                            responseBase.Success = false;
                            responseBase.Message = "Could Not Find User In Database";
                        }
                    }
                    catch (Exception ex)
                    {
                        responseBase.Success = false;
                        responseBase.Message = ex.Message;
                    }

                }
            }
            return responseBase;
        }

        public Guid GetUserGuid(string userName)
        {
            SqlDataReader dataReader;
            Guid userGuid=Guid.Empty;
            string commandText = " SELECT UserId " +
                                 " FROM aspnet_Users " +
                                 " WHERE UserName= @UserName ";

            using (SqlConnection connection = new SqlConnection(_conectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.Parameters.Add("@UserName", System.Data.SqlDbType.NVarChar).Value = userName;
                    try
                    {
                        connection.Open();
                        dataReader = command.ExecuteReader(CommandBehavior.CloseConnection);
                        if (dataReader.Read())
                        {
                            userGuid = (Guid) dataReader["UserId"];
                        }
                    }
                    catch (Exception ex)
                    {
                        
                    }

                }
            }
            return userGuid;
        }
    }
}
