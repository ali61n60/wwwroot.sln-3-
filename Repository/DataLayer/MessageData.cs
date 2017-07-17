using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Model.ServiceLibrary;

namespace Model.DataLayer
{



    /// <summary>
    /// Summary description for MessageData
    /// </summary>
    public class MessageData
    {
        public MessageData()
        {
            //
            // TODO: AddCriterias constructor logic here
            //
        }

        public bool writeMessageToDatabase(string messageTitle, string messageBody)
        {
            string conectionString =
                System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"]
                    .ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);
            SqlCommand command =
                new SqlCommand("INSERT INTO dbo.Messages(MessageTitle,MessageBody) VALUES(@param1,@param2)", connection);
            command.Parameters.Add(new SqlParameter("@param1", messageTitle));
            command.Parameters.Add(new SqlParameter("@param2", messageBody));
            int rowsAffected = 0;
            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                connection.Close();
            }
            connection.Close();
            if (rowsAffected >= 1)
                return true;
            else
                return false;
        }

        public bool writeMessageToChatTable(string sender, string reciever, string message)
        {
            int read = 0;
            string conectionString =
                System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"]
                    .ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);
            SqlCommand command =
                new SqlCommand(
                    "INSERT INTO dbo.Chat(Sender,Reciever,Message,[Read]) VALUES(@param1,@param2,@param3,@param4)",
                    connection);
            command.Parameters.Add(new SqlParameter("@param1", sender));
            command.Parameters.Add(new SqlParameter("@param2", reciever));
            command.Parameters.Add(new SqlParameter("@param3", message));
            command.Parameters.Add(new SqlParameter("@param4", read));
            int rowsAffected = 0;
            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                connection.Close();
            }
            connection.Close();
            if (rowsAffected >= 1)
                return true;
            else
                return false;
        }

        public List<messageFormat> unreadMessages(string username)
        {

            List<messageFormat> unreadList = new List<messageFormat>();
            SqlDataReader dataReader = null;
            string conectionString =
                System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"]
                    .ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);
            SqlCommand command =
                new SqlCommand("select Sender,Message from dbo.chat where  Reciever=@param1 AND [Read]=0", connection);
            //command.Parameters.AddCriterias(new SqlParameter("@param1", username));
            command.Parameters.Add("@param1", System.Data.SqlDbType.NVarChar).Value = username;



            // int rowsAffected = 0;
            messageFormat message;
            try
            {
                connection.Open();
                dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                while (dataReader.Read())
                {
                    message = new messageFormat();
                    message.sender = (string) dataReader["Sender"];
                    message.sendTo = username;
                    message.message = (string) dataReader["Message"];
                    unreadList.Add(message);
                }
                dataReader.Close();

            }
            catch (Exception ex)
            {
                connection.Close();
                return null;
            }
            command = new SqlCommand("update dbo.chat set [Read]=1 where Reciever=@param1 AND [Read]=0", connection);
            command.Parameters.Add("@param1", System.Data.SqlDbType.NVarChar).Value = username;
            try
            {
                if (connection.State == System.Data.ConnectionState.Closed)
                {
                    connection.Open();
                }
                command.ExecuteNonQuery();
                connection.Close();
            }
            catch (Exception ex)
            {
                connection.Close();
                return null;
            }

            return unreadList;


        }

        public SqlDataReader getReaderMessage(string readerName)
        {
            SqlDataReader dataReader = null;
            string conectionString =
                System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"]
                    .ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);
            SqlCommand command = new SqlCommand("select * from dbo.chat where Reciever=@param1", connection);
            command.Parameters.Add(new SqlParameter("@param1", readerName));


            int rowsAffected = 0;
            try
            {
                connection.Open();
                dataReader = command.ExecuteReader(System.Data.CommandBehavior.CloseConnection);
                return dataReader;

            }
            catch (Exception ex)
            {
                connection.Close();
            }

            return dataReader;
        }

        private bool saveUserInDatabase(string name, string emailAddress)
        {
            string conectionString =
                System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"]
                    .ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter();
            SqlConnection connection = new SqlConnection(conectionString);
            //  SqlCommand command = new SqlCommand("INSERT INTO ayoobfar_ali.Users(Name,Email) VALUES(@param1,@param2)", connection);
            SqlCommand command = new SqlCommand("ayoobfar_ali.sp_insertUser", connection);
            command.Parameters.Add(new SqlParameter("@name", name));
            command.Parameters.Add(new SqlParameter("@email", emailAddress));

            SqlParameter status = new SqlParameter("@status", System.Data.SqlDbType.Int);
            status.Direction = System.Data.ParameterDirection.Output;
            command.Parameters.Add(status);
            command.CommandType = System.Data.CommandType.StoredProcedure;

            try
            {
                connection.Open();
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                connection.Close();
            }
            connection.Close();
            if (int.Parse(status.Value.ToString()) == 1)
                return true;
            else
                return false;
        }
    }
}