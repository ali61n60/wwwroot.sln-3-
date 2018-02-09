using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Content.Res;
using Android.Preferences;
using ChiKoja.Notification;
using ChiKoja.Repository.Location;
using ChiKoja.Repository.TransportationRepository;
using ChiKoja.Services.Server;
using ModelStd.Services;
using Mono.Data.Sqlite;
using ServiceLayer;
using Environment = System.Environment;


namespace ChiKoja.Repository
{
    //TODO create database and related classes for CRUD operation
    public class Repository
    {
        private readonly ISharedPreferences prefs;
        private readonly string LocalMainDataVersionKey = "LocalMainDataVersion";
        int LocalMainDataVersionDefault = -1;
        public int LocalMainDataVersion
        {
            get => prefs.GetInt(LocalMainDataVersionKey, LocalMainDataVersionDefault);
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalMainDataVersionKey, value);
                editor.Commit();
            }
        }
        private int serverMainDataVersion;
        private double totalProgressPercent;
        private readonly List<ILocalTable> listOfLocalTables;
        private readonly List<ILocalTable> listOfLocalTablesCheckEveryTime;

        public static string DataBasePath { get; private set; }
        public static object Locker { get; private set; } // private field for database access
        public bool DatabaseChecked { get; private set; }
        
        static Repository()
        {
            
            string _databaseFileName = "database.db3";
            DataBasePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Personal), _databaseFileName);
            Locker = new object();
        }
        public Repository()
        {
            DatabaseChecked = false;
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            listOfLocalTables = new List<ILocalTable>();
            listOfLocalTablesCheckEveryTime = new List<ILocalTable>();
            populateListOfLocalTables();
            populateListOfLocalTablesCheckEveryTime();
        }
        //Add Each New Table Here
        private void populateListOfLocalTables()
        {
            ProvinceRepository provinceRepository = new ProvinceRepository(DataBasePath);
            listOfLocalTables.Add(provinceRepository);

            CityRepository cityRepository = new CityRepository(DataBasePath);
            listOfLocalTables.Add(cityRepository);

            DistrictRepository districtRepository = new DistrictRepository(DataBasePath);
            listOfLocalTables.Add(districtRepository);

            CategoryRepository categoryRepository = new CategoryRepository(DataBasePath);
            listOfLocalTables.Add(categoryRepository);

            TransportationBrandRepository transportationBrandRepository = new TransportationBrandRepository(DataBasePath);
            listOfLocalTables.Add(transportationBrandRepository);

            TransportationModelRepository transportationModelRepository = new TransportationModelRepository(DataBasePath);
            listOfLocalTables.Add(transportationModelRepository);

            listOfLocalTables.Sort((table1, table2) =>
            {
                if (table1.OperationOrder > table2.OperationOrder)
                    return -1;
                else if (table1.OperationOrder < table2.OperationOrder)
                    return 1;
                return 0;
            });
        }

        //Add Each New Table Here If Must Be Checked Everytime
        private void populateListOfLocalTablesCheckEveryTime()
        {
            //CryptoGraphy.CryptoGraphy cryptoGraphy = new CryptoGraphy.CryptoGraphy();
           // listOfLocalTablesCheckEveryTime.Add(cryptoGraphy);
        }

        //Called from SplashActivity
        public async Task ManageDatabaseFile(ICallBack callBack,int ManageDatabaseRequestCode)
        {
            if (DatabaseChecked)
            {
                //TODO move string to resource
                MessageShower.GetMessageShower(Application.Context).ShowMessage("Database Already Checked", ShowMessageType.Long);
                return;
            }

            GlobalApplication.GlobalApplication.GetMessageShower()
                .ShowMessage(Application.Context.Resources.GetString(Resource.String.CheckingDatabase),
                ShowMessageType.Permanent);
            await ManageDatabaseFileAndData(Application.Context.Resources, callBack, ManageDatabaseRequestCode);
        }
        

        
        private async Task ManageDatabaseFileAndData(Resources resources, ICallBack callBack, int requestCode)
        {
            LocalMainDataVersion = -1;//for debug remove it after debug process
            try
            {
                if (await localTablesDataNeedUpdate())
                {
                    int numberOfTables = listOfLocalTables.Count + listOfLocalTablesCheckEveryTime.Count;
                    int totalPercentForlistOfLocalTables = listOfLocalTables.Count * 100 / numberOfTables;
                    int totalPercentForlistOfLocalTablesCheckEveryTime = 100 - totalPercentForlistOfLocalTables;
                    FileStatus fileStatus = getDatabaseFileStatus();
                    fileStatus=FileStatus.FileNotExists;//for debug remove it after debug process
                    switch (fileStatus)
                    {
                        case FileStatus.FileNotExists:
                            await createDatabaseFile_Schema_InitialData(callBack, requestCode, totalPercentForlistOfLocalTables);
                            break;
                        case FileStatus.FileExists:
                            await checkTablesDataVersionAndUpdateIfNedded(callBack, requestCode, totalPercentForlistOfLocalTables);
                            break;
                    }
                    await checkTablesThatMustBeCheckedEveryTime(callBack, requestCode, totalPercentForlistOfLocalTablesCheckEveryTime);
                    LocalMainDataVersion = serverMainDataVersion;
                }
                DatabaseChecked = true;
                callBack.OnSuccess(requestCode);
            }
            catch (Exception ex)
            {
                callBack.OnError(requestCode, ex);
            }
        }

        private FileStatus getDatabaseFileStatus()
        {
            return File.Exists(DataBasePath) ? FileStatus.FileExists : FileStatus.FileNotExists;
        }

        private async Task<bool> localTablesDataNeedUpdate()
        {
            RepositoryApi repositoryApi=new RepositoryApi();
            ResponseBase<int> response= await repositoryApi.GetServerMainDataVersion();
            if (response.Success)
                serverMainDataVersion = response.ResponseData;
            else throw new Exception(response.Message);
            
            if (LocalMainDataVersion == serverMainDataVersion)
                return false;
            return true;
        }
        
        private async Task createDatabaseFile_Schema_InitialData(ICallBack callBack, int requestCode, int totalPercent)
        {
            SqliteConnection.CreateFile(DataBasePath);// create new database file **overwrite if exist
            createDatabaseSchema();
            await populateTablesDataFromServerAsync(callBack, requestCode, totalPercent);
            await createNotCategorizedTables();
        }
        private void createDatabaseSchema()
        {
            foreach (ILocalTable localTable in listOfLocalTables)
            {
                localTable.CreateTable(Locker);//TODO province must be called first, cities must be called second ,districts,must be called third
            }
        }
        private async Task populateTablesDataFromServerAsync(ICallBack callBack, int requestCode, int totalPercent)
        {
            double singleStepPercent = totalPercent / listOfLocalTables.Count;
            foreach (ILocalTable localTable in listOfLocalTables)
            {
                await localTable.PopulateTableDataFromServer(Locker);//TODO province must be called first, cities must be called second ,districts,must be called third
                incrementProgressAndNotifyCaller(callBack, requestCode, singleStepPercent);
            }
        }


        private void incrementProgressAndNotifyCaller(ICallBack callBack, int requestCode, double incrementProgressPercent)
        {
            totalProgressPercent += incrementProgressPercent;
            callBack.OnProgress(requestCode, (int)totalProgressPercent);
        }

        private async Task createNotCategorizedTables()
        {
            //create UserMarkedAds table
            UserMarkedAds.UserMarkedAds userMarkedAds = new UserMarkedAds.UserMarkedAds(DataBasePath);
            userMarkedAds.CreateTable(Locker);
        }

        private async Task checkTablesDataVersionAndUpdateIfNedded(ICallBack callBack, int requestCode, int totalPercent)
        {
            double singleStepPercent = totalPercent / listOfLocalTables.Count;
            foreach (ILocalTable localTable in listOfLocalTables)
            {
                localTable.CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(Locker);
                incrementProgressAndNotifyCaller(callBack, requestCode, (int)singleStepPercent);
            }
        }

        private async Task checkTablesThatMustBeCheckedEveryTime(ICallBack callBack, int requestCode, int totalPercent)
        {
            double singleStepPercent = 20;// totalPercent / listOfLocalTablesCheckEveryTime.Count;
            foreach (ILocalTable localTable in listOfLocalTablesCheckEveryTime)
            {
                localTable.CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(Locker);
                incrementProgressAndNotifyCaller(callBack, requestCode, singleStepPercent);
            }
        }

        public void SynchDatabase(ICallBack callBack, int requestCode)
        {
            //Remove local tables data
            foreach (ILocalTable localTable in listOfLocalTables)
            {
                localTable.RemoveTableData(Locker);
                localTable.PopulateTableDataFromServer(Locker);
            }
            foreach (ILocalTable localTable in listOfLocalTablesCheckEveryTime)
            {
                localTable.RemoveTableData(Locker);
            }
            //get tables data from server and insert data in local tables
        }
    }

    public enum FileStatus
    {
        FileNotExists,
        FileExists
    }

    //Pre Existing database file
    /*
     * [Application]
public class YourAndroidApp : Application {
public override void OnCreate ()
{
    base.OnCreate ();
    var docFolder = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
    Console.WriteLine ("Data path:" + Database.DatabaseFilePath);
    var dbFile = Path.Combine(docFolder, "data.sqlite"); // FILE NAME TO USE WHEN COPIED
    if (!System.IO.File.Exists(dbFile)) {
        var s = Resources.OpenRawResource(Resource.Raw.data);  // DATA FILE RESOURCE ID
        FileStream writeStream = new FileStream(dbFile, FileMode.OpenOrCreate, FileAccess.Write);
        ReadWriteStream(s, writeStream);
    }
}
// readStream is the stream you need to read
// writeStream is the stream you want to write to
private void ReadWriteStream(Stream readStream, Stream writeStream)
{
    int Length = 256;
    Byte[] buffer = new Byte[Length];
    int bytesRead = readStream.Read(buffer, 0, Length);
    // write the required bytes
    while (bytesRead > 0)
    {
        writeStream.Write(buffer, 0, bytesRead);
        bytesRead = readStream.Read(buffer, 0, Length);
    }
    readStream.Close();
    writeStream.Close();
}
}
     * */
}