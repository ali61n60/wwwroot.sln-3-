using System;
using System.Collections.Generic;
using System.Data;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ModelStd.Advertisements.Location;
using ModelStd.Services;
using Mono.Data.Sqlite;

namespace ChiKoja.Repository.Location
{
    public class CityRepository : ILocalTable
    {
        SqliteConnection connection;
        ISharedPreferences prefs;
        public int OperationOrder { get; private set; }

        private readonly string LocalCityDataVersionKey = "LocalCityDataVersionKey";
        private readonly int LocalCityDataVersionDefault = -1;

        private readonly string LocationKey = "LocationKey";
        string defaultCity = "تهران";

        public CityRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 2;//must be less than district table
        }

        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            LocationApi locationApi = new LocationApi();
            ResponseBase<int> response =await locationApi.GetLocationyVersion();
            if (response.Success)
            {
                int serverCityDataVersion = response.ResponseData;
                if (serverCityDataVersion != LocalCitiesTableDataVersion)
                {
                    RemoveTableData(locker);
                    PopulateTableDataFromServer(locker);
                    LocalCitiesTableDataVersion = serverCityDataVersion;
                }
            }
            else
            {
                //TODO error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [Cities] (
                                     cityId int PRIMARY KEY,
                                     cityName ntext,
                                     provinceId int,
                                     selectedByUser BOOLEAN,
                                     FOREIGN KEY (provinceId) REFERENCES Provinces(provinceId)
                                        );";
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand c = connection.CreateCommand())
                {
                    c.CommandText = commandText;
                    c.ExecuteNonQuery();
                }
                connection.Close();
            }
        }
        public City[] GetAll(object locker)
        {
            List<City> allCities = new List<City>();
            City tempCity;

            lock (locker)
            {
                connection.Open();
                using (var contents = connection.CreateCommand())
                {
                    contents.CommandText =
                        "SELECT [cityId],[cityName],[provinceId] FROM [Cities]";
                    var r = contents.ExecuteReader();

                    while (r.Read())
                    {
                        tempCity = new City((int) r["cityId"],
                            r["cityName"].ToString(),
                            (int) r["provinceId"]);
                        allCities.Add(tempCity);
                    }
                }
                connection.Close();
            }
            return allCities.ToArray();
        }
        public void PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [Cities]
                                            ([cityId],[cityName],[provinceId],[selectedByUser])
                                            VALUES (@cityId ,@cityName ,@provinceId,@selectedByUser)";
            //get data from server
            LocationApi locationApi = new LocationApi();
            ResponseBase<City[]> response = locationApi.GetAllCities();
            if (response.Success)
            {
                //insert server data into loacal Cities Table
                lock (locker)
                {
                    connection.Open();
                    foreach (City city in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("cityId", DbType.Int32).Value = city.CityId;
                            c.Parameters.Add("cityName", DbType.String).Value = city.CityName;
                            c.Parameters.Add("provinceId", DbType.Int32).Value = city.ProvinceId;
                            c.Parameters.Add("selectedByUser", DbType.Boolean).Value = false;
                            var rowcount = c.ExecuteNonQuery();
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
            string commandText = "delete  from [Cities]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }


        public int LocalCitiesTableDataVersion
        {
            get { return prefs.GetInt(LocalCityDataVersionKey, LocalCityDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalCityDataVersionKey, value);
                editor.Commit();
            }
        }

        public string CityPreference
        {
            get { return prefs.GetString(LocationKey, defaultCity); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutString(LocationKey, value);
                editor.Commit();
            }
        }

        public City[] GetSelectedCities(object locker)
        {
            List<City> selectedCities = new List<City>();
            City tempCity;

            lock (locker)
            {
                try
                {
                    connection.Open();
                    using (SqliteCommand command = connection.CreateCommand())
                    {
                        command.CommandText =
                            "SELECT [cityId],[cityName],[provinceId] FROM [Cities] WHERE [selectedByUser]=1";
                        var r = command.ExecuteReader();

                        while (r.Read())
                        {
                            tempCity = new City((int) r["cityId"],
                                r["cityName"].ToString(),
                                (int) r["provinceId"]);
                            selectedCities.Add(tempCity);
                        }
                    }
                   
                }
                catch (Exception)
                {
                    //TODO Decide what to do
                }
                finally
                {
                    connection.Close();
                }
               
            }
            return selectedCities.ToArray();
        }
        
        public Dictionary<string,string> GetCityDictionary()
        {
            Dictionary<string, string> tempKeyValueOfstringstring = new Dictionary<string, string>();
            tempKeyValueOfstringstring["City"] = prefs.GetString(LocationKey, defaultCity);
            return tempKeyValueOfstringstring;
        }

        public void SetCityAsSelected(City city, object locker)
        {
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Cities] SET [selectedByUser]=1 WHERE [cityId]=@cityId";
                    sqliteCommand.Parameters.Add("cityId", DbType.Int32).Value = city.CityId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }
        public void SetCityAsNotSelected(City city, object locker)
        {
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Cities] SET [selectedByUser]=0 WHERE [cityId]=@cityId";
                    sqliteCommand.Parameters.Add("cityId", DbType.Int32).Value = city.CityId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }

        public City[] GetCitiesInProvince(Province province, object locker)
        {
            List<City> allProvinceCities=new List<City>();
            City tempCity;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        "SELECT [cityId],[cityName],[provinceId] FROM [Cities] WHERE [provinceId]=@provinceId";
                    command.Parameters.Add("provinceId", DbType.Int32).Value = province.ProvinceId;
                    var r = command.ExecuteReader();

                    while (r.Read())
                    {
                        tempCity = new City((int) r["cityId"],
                            r["cityName"].ToString(),
                            (int) r["provinceId"]);
                        allProvinceCities.Add(tempCity);
                    }
                }
                connection.Close();
            }

            return allProvinceCities.ToArray();
        }
    }
}