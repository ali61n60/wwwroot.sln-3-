using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;

/// <summary>
/// Summary description for VisitorsStatistic
/// </summary>
public class VisitorsStatistic
{
	public VisitorsStatistic()
	{
		//
		// TODO: AddCriterias constructor logic here
		//
	}

    public static int getNumberOfVisitors()
    {
        int numberOfVisitors=0;
        string conectionString = System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"].ConnectionString;
        SqlDataAdapter adapter = new SqlDataAdapter();
        SqlConnection connection = new SqlConnection(conectionString);
        SqlCommand command = new SqlCommand("getNumberOfVisitors",connection);
      
        command.CommandType=System.Data.CommandType.StoredProcedure;
        SqlParameter outputParameter=command.Parameters.Add("@NoOfVisitors",System.Data.SqlDbType.Int);
        outputParameter.Direction = System.Data.ParameterDirection.Output;
        try
        {
            connection.Open();
            command.ExecuteNonQuery();
            numberOfVisitors = (int)outputParameter.Value;
            connection.Close();

        }
        catch(Exception ex)
        {
            numberOfVisitors=0;
            connection.Close();
        }

        return numberOfVisitors;
    }


    public static void incrementNumberOfVisitors()
    {
        string conectionString = System.Configuration.ConfigurationManager.ConnectionStrings["petropas_dbConnectionString"].ConnectionString;
        SqlDataAdapter adapter = new SqlDataAdapter();
        SqlConnection connection = new SqlConnection(conectionString);
        SqlCommand command = new SqlCommand("spIncrementNumberOfVisitors", connection);

        command.CommandType = System.Data.CommandType.StoredProcedure;
        
        try
        {
            connection.Open();
            command.ExecuteNonQuery();
            
            connection.Close();

        }
        catch (Exception ex)
        {
           
            connection.Close();
        }

    }
}