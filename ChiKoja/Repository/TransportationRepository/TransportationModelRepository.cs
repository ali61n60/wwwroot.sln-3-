using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ModelStd.Advertisements.Transportation;
using ModelStd.Db.Ad;
using ModelStd.Services;
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
        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            AdTransportationApi adTransportationApi = new AdTransportationApi();

            ResponseBase<int> response =await adTransportationApi.GetServerDataVersion();
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
        public async Task PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [TransportationModels] 
                                   ([modelId],[modelName],[brandId])
                                   VALUES (@modelId,@modelName,@brandId)";
            AdTransportationApi adTransportationApi = new AdTransportationApi();
            ResponseBase<CarModel[]> response =await
                adTransportationApi.GetAllTransportationModels();

            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (CarModel transportationModel in response.ResponseData)
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

        public CarModel[] GetAll(object locker)
        {
            List<CarModel> allModels = new List<CarModel>();
            CarModel tempModel;
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
                        tempModel = new CarModel();
                        tempModel.ModelId = (int) r["modelId"];
                       tempModel.ModelName= r["modelName"].ToString();
                            tempModel.BrandId= (int)r["brandId"];
                        allModels.Add(tempModel);
                    }
                }
                connection.Close();
            }
            return allModels.ToArray();
        }
        

        public CarModel[] GetAllModelsInBrand(object locker,int brandId)
        {
            List<CarModel> allModels = new List<CarModel>();
            CarModel tempModel;
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
                        tempModel = new CarModel();
                        tempModel.ModelId=(int)r["modelId"];
                        tempModel.ModelName= r["modelName"].ToString();
                           tempModel.BrandId= (int)r["brandId"];
                        allModels.Add(tempModel);
                    }
                }
                connection.Close();
            }
            return allModels.ToArray();
        }
    }
}