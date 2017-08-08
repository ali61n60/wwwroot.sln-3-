using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Preferences;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.AdTransportationService;
using Mono.Data.Sqlite;

namespace ChiKoja.Repository.TransportationRepository
{
    public class TransportationModelRepository : ILocalTable
    {
        private readonly ISharedPreferences prefs;
        private readonly SqliteConnection connection;
        private readonly string LocalTransportationModelDataVersionKey = "LocalTransportationModelDataVersion";
        int LocalTransportationModelDataVersionDefault = -1;
        public int LocalTransportationModelDataVersion
        {
            get { return prefs.GetInt(LocalTransportationModelDataVersionKey, LocalTransportationModelDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalTransportationModelDataVersionKey, value);
                editor.Commit();
            }
        }
        public int OperationOrder { get; private set; }

        public TransportationModelRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 7;
        }
        public void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            AdvertisementTransportationService transportationService = new AdvertisementTransportationService();

            ResponseBaseOfint response = transportationService.GetServerDataVersion();
            if (response.Success)
            {
                int serverDataVersion = response.ResponseData;
                if (serverDataVersion != LocalTransportationModelDataVersion)
                {
                    RemoveTableData(locker);//remove old data from category table
                    PopulateTableDataFromServer(locker);
                    LocalTransportationModelDataVersion = serverDataVersion;//update localCategoryVersion
                }
            }
            else
            {
                //TODO error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [TransportationModels](
                                    modelId int PRIMARY Key,
                                    modelName ntext,
                                    brandId int,
                                    FOREIGN KEY (brandId) REFERENCES TransportationBrands(brandId)                                     
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
        public void PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [TransportationModels] 
                                   ([modelId],[modelName],[brandId])
                                   VALUES (@modelId,@modelName,@brandId)";
            AdvertisementTransportationService transportationService = new AdvertisementTransportationService();
            ResponseBaseOfArrayOfTransportationModeloKnNwMS4 response =
                transportationService.GetAllTransportationModels();

            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (TransportationModel transportationModel in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("modelId", DbType.Int32).Value = transportationModel.ModelId;
                            c.Parameters.Add("modelName", DbType.String).Value = transportationModel.ModelName;
                            c.Parameters.Add("brandId", DbType.Int32).Value = transportationModel.BrandId;
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
            string commandText = "delete  from [TransportationModels]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }

        public TransportationModel[] GetAll(object locker)
        {
            List<TransportationModel> allModels = new List<TransportationModel>();
            TransportationModel tempModel;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [modelId],[modelName],[brandId] FROM [TransportationModels]";
                    var r = sqliteCommand.ExecuteReader();
                    while (r.Read())
                    {
                        tempModel = new TransportationModel()
                        {
                            ModelId = (int)r["modelId"],
                            ModelName = r["modelName"].ToString(),
                            BrandId = (int)r["brandId"]
                        };
                        allModels.Add(tempModel);
                    }
                }
                connection.Close();
            }
            return allModels.ToArray();
        }
        

        public TransportationModel[] GetAllModelsInBrand(object locker,int brandId)
        {
            List<TransportationModel> allModels = new List<TransportationModel>();
            TransportationModel tempModel;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [modelId],[modelName],[brandId] FROM [TransportationModels] WHERE [brandId]=@brandId";
                    sqliteCommand.Parameters.Add("brandId", DbType.Int32).Value = brandId;
                    var r = sqliteCommand.ExecuteReader();
                    while (r.Read())
                    {
                        tempModel = new TransportationModel()
                        {
                            ModelId = (int)r["modelId"],
                            ModelName = r["modelName"].ToString(),
                            BrandId = (int)r["brandId"]
                        };
                        allModels.Add(tempModel);
                    }
                }
                connection.Close();
            }
            return allModels.ToArray();
        }

        
    }
}