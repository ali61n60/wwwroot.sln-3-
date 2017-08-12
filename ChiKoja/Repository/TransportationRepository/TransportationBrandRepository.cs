using System.Collections.Generic;
using Android.App;
using Android.Content;
using Android.Preferences;
using Mono.Data.Sqlite;
using System.Data;
using ChiKoja.Services.Server;
using ModelStd.Advertisements.Transportation;
using ModelStd.Services;

namespace ChiKoja.Repository.TransportationRepository
{
    class TransportationBrandRepository : ILocalTable
    {
        private readonly ISharedPreferences prefs;
        private readonly SqliteConnection connection;

        private readonly string LocalTransportationBrandDataVersionKey = "LocalTransportationBrandDataVersion";
        int LocalTransportationBrandDataVersionDefault = -1;
        public int LocalTransportationBrandDataVersion
        {
            get { return prefs.GetInt(LocalTransportationBrandDataVersionKey, LocalTransportationBrandDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalTransportationBrandDataVersionKey, value);
                editor.Commit();
            }
        }

        public int OperationOrder { get; private set; }

        public TransportationBrandRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 6;
        }
        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            AdTransportationApi transportationService=new AdTransportationApi();
            
            ResponseBase<int> response =await transportationService.GetServerDataVersion();
            if (response. Success)
            {
                int serverDataVersion = response.ResponseData;
                if (serverDataVersion != LocalTransportationBrandDataVersion)
                {
                    RemoveTableData(locker);//remove old data from category table
                    PopulateTableDataFromServer(locker);
                    LocalTransportationBrandDataVersion = serverDataVersion;//update localCategoryVersion
                }
            }
            else
            {
                //TODO error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [TransportationBrands](
                                      brandId int PRIMARY KEY,
                                      brandName ntext                                      
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
        public async void PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [TransportationBrands] 
                                   ([brandId], [brandName])
                                   VALUES (@brandId, @brandName)";
            AdTransportationApi adTransportationApi=new AdTransportationApi();
            ResponseBase<TransportationBrand[]> response =await adTransportationApi.GetAllTransportationBrands();

            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (TransportationBrand transportationBrand in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("brandId", DbType.Int32).Value = transportationBrand.BrandId;
                            c.Parameters.Add("brandName", DbType.String).Value = transportationBrand.BrandName;
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
            string commandText = "delete  from [TransportationBrands]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }

        public TransportationBrand[] GetAll(object locker)
        {
            List<TransportationBrand> allBrands = new List<TransportationBrand>();
            TransportationBrand tempBrand;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [brandId],[brandName] FROM [TransportationBrands]";
                    var r = sqliteCommand.ExecuteReader();
                    while (r.Read())
                    {
                        tempBrand = new TransportationBrand((int)r["brandId"],
                            r["brandName"].ToString());
                        allBrands.Add(tempBrand);
                    }
                }
                connection.Close();
            }
            return allBrands.ToArray();
        }
    }

    
}