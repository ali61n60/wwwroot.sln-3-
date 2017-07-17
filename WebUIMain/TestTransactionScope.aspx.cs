using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace WebUIMain
{
    public partial class TestTransactionScope : System.Web.UI.Page
    {
        string connectString1;        
        string commandText1;
        string commandText2;

        protected void Page_Load(object sender, EventArgs e)
        {
            Random rand = new Random();
            int id = 1000 + 5 * rand.Next(100000);

            connectString1 = System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"].ConnectionString;
            commandText1 = "INSERT INTO Test3(Id,name) values("+id.ToString()+",'ali')";
            commandText2 = "INSERT INTO Test4(Id,name) values(" + id.ToString() + ",'reza')";
            CreateTransactionScope();          
        }

        public int CreateTransactionScope()
        {
            // Initialize the return value to zero and create a StringWriter to display results.
            int returnValue = 0;
            //System.IO.StringWriter writer = new System.IO.StringWriter();

            try
            {
                // Create the TransactionScope to execute the commands, guaranteeing
                // that both commands can commit or roll back as a single unit of work.
                using (TransactionScope scope = new TransactionScope())
                {
                    using (SqlConnection connection1 = new SqlConnection(connectString1))
                    {
                        // Opening the connection automatically enlists it in the 
                        // TransactionScope as a lightweight transaction.
                        connection1.Open();

                        // Create the SqlCommand object and execute the first command.
                        SqlCommand command1 = new SqlCommand(commandText1, connection1);
                        returnValue = command1.ExecuteNonQuery();
                        throw new Exception();
                        //writer.WriteLine("Rows to be affected by command1: {0}", returnValue);

                        // If you get here, this means that command1 succeeded. By nesting
                        // the using block for connection2 inside that of connection1, you
                        // conserve server and network resources as connection2 is opened
                        // only when there is a chance that the transaction can commit.   
                        using (SqlConnection connection2 = new SqlConnection(connectString1))
                        {
                            // The transaction is escalated to a full distributed
                            // transaction when connection2 is opened.
                            connection2.Open();

                            // Execute the second command in the second database.
                            returnValue = 0;
                            SqlCommand command2 = new SqlCommand(commandText2, connection2);
                            returnValue = command2.ExecuteNonQuery();
                            // writer.WriteLine("Rows to be affected by command2: {0}", returnValue);
                        }

                    }

                    // The Complete method commits the transaction. If an exception has been thrown,
                    // Complete is not  called and the transaction is rolled back.
                    //scope.Complete();
                }

            }
            catch (TransactionAbortedException ex)
            {
                //writer.WriteLine("TransactionAbortedException Message: {0}", ex.Message);
            }
            catch (ApplicationException ex)
            {
                // writer.WriteLine("ApplicationException Message: {0}", ex.Message);
            }
            catch (Exception ex)
            {

            }

            // Display messages.
            //Console.WriteLine(writer.ToString());

            return returnValue;
        }

    }
}



