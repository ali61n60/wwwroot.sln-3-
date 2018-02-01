using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ModelStd.Db.Ad;
using ModelStd.Services;
using Mono.Data.Sqlite;

namespace ChiKoja.Repository.Location
{
    public class ProvinceRepository:ILocalTable
    {
        SqliteConnection connection;
        ISharedPreferences prefs;
        private readonly string LocalProvinceDataVersionKey = "LocalProvinceDataVersionKey";
        private readonly int LocalProvinceDataVersionDefault = -1;
        public int OperationOrder { get; private set; }
        public int LocalProvincesTableDataVersion
        {
            get { return prefs.GetInt(LocalProvinceDataVersionKey, LocalProvinceDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalProvinceDataVersionKey, value);
                editor.Commit();
            }
        }

        public ProvinceRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 1;//must be less than city table
        }
        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            LocationApi locationApi = new LocationApi();
            ResponseBase<int> response =await locationApi.GetLocationyVersion();
            if (response.Success)
            {
                int serverProvinceDataVersion = response.ResponseData;
                if (serverProvinceDataVersion != LocalProvincesTableDataVersion)//local vs server version  mismatch
                {
                    RemoveTableData(locker);
                    PopulateTableDataFromServer(locker);
                    LocalProvincesTableDataVersion = serverProvinceDataVersion; //update localLocationVersion
                }
            }
            else
            {
                //error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [Provinces](
                                      provinceId int PRIMARY KEY,
                                      provinceName ntext,
                                      provinceCenter ntext,
                                      selectedByUser BOOLEAN
                                      );";
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText = commandText;
                    sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }
        public Province[] GetAll(object locker) 
        {
            List<Province> allProvinces = new List<Province>();
            Province tempProvince;

            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [provinceId],[provinceName],[provinceCenter] FROM [Provinces]";
                    var r = sqliteCommand.ExecuteReader();

                    while (r.Read())
                    {
                        tempProvince = new Province((int) r["provinceId"],
                            r["provinceName"].ToString(),
                            r["provinceCenter"].ToString());
                        allProvinces.Add(tempProvince);
                    }
                }
                connection.Close();
            }
            return allProvinces.ToArray();
        }
        public async Task PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [Provinces]
                                            ([provinceId],[provinceName],[provinceCenter],[selectedByUser])
                                            VALUES (@provinceId ,@provinceName ,@provinceCenter,@selectedByUser)";
            //get data from server
            LocationApi locationApi = new LocationApi();
            ResponseBase<Province[]> response =await locationApi.GetAllProvinces();
            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (Province province in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("provinceId", DbType.Int32).Value = province.ProvinceId;
                            c.Parameters.Add("provinceName", DbType.String).Value = province.ProvinceName;
                            c.Parameters.Add("provinceCenter", DbType.String).Value = province.ProvinceCenter;
                            c.Parameters.Add("selectedByUser", DbType.Boolean).Value = false;
                            int rowcount = c.ExecuteNonQuery();
                        }
                    }
                    connection.Close();
                }
            }
            else
            {
                //error in getting category data from server
            }
        }
        public void RemoveTableData(object locker)
        {
            string commandText = "delete  from [Provinces]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }
        public Province[] GetSelectedProvinces()
        {
            List<Province> selectedProvinces = new List<Province>();
            Province tempProvince;
            lock (Repository.Locker)
            {
                try
                {
                    connection.Open();
                    using (SqliteCommand sqliteCommand = connection.CreateCommand())
                    {
                        sqliteCommand.CommandText =
                            "SELECT [provinceId],[provinceName],[provinceCenter] FROM [Provinces] WHERE [selectedByUser]=1";
                        var r = sqliteCommand.ExecuteReader();
                        while (r.Read())
                        {
                            tempProvince = new Province();
                            tempProvince.ProvinceId = (int) r["provinceId"];
                            tempProvince.ProvinceName= r["provinceName"].ToString();
                               tempProvince.ProvinceCenter= r["provinceCenter"].ToString();
                            selectedProvinces.Add(tempProvince);
                        }
                    }
                }
                catch (Exception)
                {
                    //TODO decide what to do in case of exception
                }
                finally
                {
                    connection.Close();
                }
            }

            return selectedProvinces.ToArray();
        }

        public void SetProvinceAsSelected(Province province)
        {
            lock (Repository.Locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Provinces] SET [selectedByUser]=1 WHERE [provinceId]=@provinceId";
                    sqliteCommand.Parameters.Add("provinceId", DbType.Int32).Value = province.ProvinceId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }

        public void SetProvinceAsNotSelected(Province province)
        {
            lock (Repository.Locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Provinces] SET [selectedByUser]=0 WHERE [provinceId]=@provinceId";
                    sqliteCommand.Parameters.Add("provinceId", DbType.Int32).Value = province.ProvinceId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }

       

       

       

       
    }
}