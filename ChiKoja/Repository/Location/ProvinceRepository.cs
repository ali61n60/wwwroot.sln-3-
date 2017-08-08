using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System.IO;
using Android.Preferences;
using ChiKoja.LocationService;
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
        public void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            LocationService.LocationService locationService = new LocationService.LocationService();
            ResponseBaseOfint response = locationService.GetLocationyVersion();
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
        public LocationService.Province[] GetAll(object locker) 
        {
            List<LocationService.Province> allProvinces = new List<LocationService.Province>();
            LocationService.Province tempProvince;

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
                        tempProvince = new LocationService.Province();
                        tempProvince.ProvinceId = (int)r["provinceId"];
                        tempProvince.ProvinceName = r["provinceName"].ToString();
                        tempProvince.ProvinceCenter = r["provinceCenter"].ToString();
                        allProvinces.Add(tempProvince);
                    }
                }
                connection.Close();
            }
            return allProvinces.ToArray();
        }
        public void PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [Provinces]
                                            ([provinceId],[provinceName],[provinceCenter],[selectedByUser])
                                            VALUES (@provinceId ,@provinceName ,@provinceCenter,@selectedByUser)";
            //get data from server
            LocationService.LocationService locationService = new LocationService.LocationService();
            ResponseBaseOfArrayOfProvince63bt_SHOU response = locationService.GetAllProvinces();
            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (LocationService.Province province in response.ResponseData)
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
        public LocationService.Province[] GetSelectedProvinces()
        {
            List<LocationService.Province> selectedProvinces = new List<LocationService.Province>();
            LocationService.Province tempProvince;
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
                            tempProvince = new LocationService.Province
                            {
                                ProvinceId = (int)r["provinceId"],
                                ProvinceName = r["provinceName"].ToString(),
                                ProvinceCenter = r["provinceCenter"].ToString()
                            };
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

        public void SetProvinceAsSelected(LocationService.Province province)
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

        public void SetProvinceAsNotSelected(LocationService.Province province)
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