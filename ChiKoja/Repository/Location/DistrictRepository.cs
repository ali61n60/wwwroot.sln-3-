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
    public class DistrictRepository:ILocalTable
    {
        SqliteConnection connection;
        ISharedPreferences prefs;
        public int OperationOrder { get; private set; }

        private readonly string LocalDistrictDataVersionKey = "LocalDistrictsDataVersion";
        private readonly int LocalDistrictDataVersionDefault = -1;

        public DistrictRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 3;
        }
        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            LocationApi locationService = new LocationApi();
            ResponseBase<int> response =await locationService.GetLocationyVersion();
            if (response.Success)
            {
                int serverDistrictDataVersion = response.ResponseData;
                if (serverDistrictDataVersion != LocalDistrictsTableDataVersion)
                {
                    RemoveTableData(locker);
                    PopulateTableDataFromServer(locker);
                    LocalDistrictsTableDataVersion = serverDistrictDataVersion;
                }
            }
            else
            {
                //TODO error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [Districts] (
                                      districtId int PRIMARY KEY,
                                      DistrictName ntext,
                                      cityId int,
                                      municipalId int,
                                      selectedByUser BOOLEAN,
                                      FOREIGN KEY (cityId) REFERENCES Cities(cityId)
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
        public District[] GetAll(object locker)
        {
            List<District> allDistricts = new List<District>();
            District tempDistrict;
            lock (locker)
            {
                connection.Open();
                using (var contents = connection.CreateCommand())
                {
                    contents.CommandText =
                        "SELECT [districtId],[DistrictName],[cityId],[municipalId] FROM [Districts]";
                    var r = contents.ExecuteReader();
                    while (r.Read())
                    {
                        tempDistrict = new District((int)r["districtId"],
                            r["DistrictName"].ToString(),
                            (int)r["cityId"],
                            (int)r["municipalId"]);
                        allDistricts.Add(tempDistrict);
                    }
                }
                connection.Close();
            }
            return allDistricts.ToArray();
        }
        public void PopulateTableDataFromServer(object locker) 
        {
            string commandText = @"INSERT INTO [Districts]
                                            ([districtId],[DistrictName],[cityId],[municipalId],[selectedByUser])
                                            VALUES (@districtId ,@DistrictName ,@cityId,@municipalId,@selectedByUser)";
            LocationApi locationApi = new LocationApi();
            ResponseBase<District[]> response = locationApi.GetAllDistricts();
            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (District district in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("districtId", DbType.Int32).Value = district.DistrictId;
                            c.Parameters.Add("DistrictName", DbType.String).Value = district.DistrictName;
                            c.Parameters.Add("cityId", DbType.Int32).Value = district.CityId;
                            c.Parameters.Add("municipalId", DbType.Int32).Value = district.MunicipalId;
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
            string commandText = "delete  from [Districts]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }
        public int LocalDistrictsTableDataVersion
        {
            get { return prefs.GetInt(LocalDistrictDataVersionKey, LocalDistrictDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalDistrictDataVersionKey, value);
                editor.Commit();
            }
        }
        public string DistrictPreference { get { return "Not Implemented Yet"; } }
        public District[] GetSelecteDistricts()
        {
            List<District> selectedDistricts = new List<District>();
            District tempDistrict;
            lock (Repository.Locker)
            {
                connection.Open();
                using (var contents = connection.CreateCommand())
                {
                    contents.CommandText =
                        "SELECT [districtId],[DistrictName],[cityId],[municipalId] FROM [Districts] WHERE [selectedByUser]=1";
                    var r = contents.ExecuteReader();
                    while (r.Read())
                    {
                        tempDistrict = new District((int)r["districtId"],
                            r["DistrictName"].ToString(),
                            (int)r["cityId"],
                            (int)r["municipalId"]);
                        selectedDistricts.Add(tempDistrict);
                    }
                }
                connection.Close();
            }
            return selectedDistricts.ToArray();
        }
        public void SetDistrictAsSelected(District district)
        {
            lock (Repository.Locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Districts] SET [selectedByUser]=1 WHERE [districtId]=@districtId";
                    sqliteCommand.Parameters.Add("districtId", DbType.Int32).Value = district.DistrictId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }
        public void SetDistrictAsNotSelected(District district)
        {
            lock (Repository.Locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "UPDATE [Districts] SET [selectedByUser]=0 WHERE [districtId]=@districtId";
                    sqliteCommand.Parameters.Add("districtId", DbType.Int32).Value = district.DistrictId;
                    int rowsAffected = sqliteCommand.ExecuteNonQuery();
                }
                connection.Close();
            }
        }
        public KeyValuePair<string,string> GetDistrictDictionary()
        {
            List<District> selecteDistricts = new List<District>();
            List<City> selectedCityies = new List<City>();
            ProvinceRepository provinceRepository = new ProvinceRepository(Repository.DataBasePath);
            CityRepository cityRepository = new CityRepository(Repository.DataBasePath);
           
           
            Province[] selectedProvinces = provinceRepository.GetSelectedProvinces();
            foreach (Province selectedProvince in selectedProvinces)
            {
                City[] selectedCityiesInSelectedProvince = cityRepository.GetCitiesInProvince(selectedProvince, Repository.Locker);
                selectedCityies.AddRange(selectedCityiesInSelectedProvince);
            }
            City[] selectedCitiesInCitiesTable = cityRepository.GetSelectedCities(Repository.Locker);
            selectedCityies.AddRange(selectedCitiesInCitiesTable);

            foreach (City selectedCity in selectedCityies)
            {
                District[] selectedDistrictsInSelectedCity = GetDistrictsInCity(selectedCity);
                selecteDistricts.AddRange(selectedDistrictsInSelectedCity);
            }
            District[] selectedDistrictsInDistrictsTable = GetSelecteDistricts();
            selecteDistricts.AddRange(selectedDistrictsInDistrictsTable);
            string districtDictionaryValue = "";
            foreach (District selecteDistrict in selecteDistricts)
            {
                districtDictionaryValue += selecteDistrict.DistrictId + ",";
            }
            if (districtDictionaryValue.Length > 0)
            {
                districtDictionaryValue = districtDictionaryValue.Substring(0, districtDictionaryValue.Length - 1);//delete last ","
            }
            KeyValuePair<string, string> districtDictinary =
                new KeyValuePair<string, string>("DistrictId", districtDictionaryValue);
            return districtDictinary;
        }
        private District[] GetDistrictsInCity(City city)
        {
            List<District> allCityDistricts = new List<District>();
            District tempDistrict;
            lock (Repository.Locker)
            {
                connection.Open();
                using (SqliteCommand command = connection.CreateCommand())
                {
                    command.CommandText =
                        "SELECT [districtId],[DistrictName],[cityId],[municipalId] FROM [Districts] WHERE [cityId]=@cityId";
                    command.Parameters.Add("cityId", DbType.Int32).Value = city.CityId;
                    var r = command.ExecuteReader();

                    while (r.Read())
                    {
                        tempDistrict = new District((int) r["districtId"],
                            r["DistrictName"].ToString(),
                            (int) r["cityId"],
                            (int) r["municipalId"]);
                        allCityDistricts.Add(tempDistrict);
                        
                    }
                }
                connection.Close();
            }

            return allCityDistricts.ToArray();
        }

        
    }
}