using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ModelStd.Services;
using Mono.Data.Sqlite;
using ServiceLayer;
using ModelStd.Advertisements;

namespace ChiKoja.Repository
{
    public class CategoryRepository:ILocalTable
    {
        private readonly ISharedPreferences prefs;
        private readonly SqliteConnection connection;
        public int OperationOrder { get; private set; }

        private readonly string LocalCategoryDataVersionKey = "LocalCategoryDataVersion";
        int LocalCategoryDataVersionDefault = -1;
        public int LocalCategoriesTableDataVersion
        {
            get { return prefs.GetInt(LocalCategoryDataVersionKey, LocalCategoryDataVersionDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutInt(LocalCategoryDataVersionKey, value);
                editor.Commit();
            }
        }

        string CategoryIdKey = "CategoryId";//used in server
        string defaultCategoryId = "0";
        public IEnumerable<int> CategoryId
        {
            get
            {
                string savedCategoryIds = prefs.GetString(CategoryIdKey, defaultCategoryId);
                string[] savedCategories = savedCategoryIds.Split(',');
                return savedCategories.Select(savedCategory => Parser.ParseInt(savedCategory, Parser.ParseInt(defaultCategoryId, 0)));
            }
            set
            {
                string stringSelectedCategoryIds = value.Aggregate("", (current, categoryId) => current + (categoryId + ","));
                if (stringSelectedCategoryIds.Length > 0)
                    stringSelectedCategoryIds = stringSelectedCategoryIds.Substring(0, stringSelectedCategoryIds.Length - 1);
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutString(CategoryIdKey, stringSelectedCategoryIds);
                editor.Commit();
            }
        }
        public CategoryRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            OperationOrder = 4;
        }
        public async void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker)
        {
            CategoryApi categoryApi = new CategoryApi();
            ResponseBase<int> response =await categoryApi.GetServerDataVersion();
            if (response.Success)
            {
                int serverCategoryDataVersion = response.ResponseData;
                if (serverCategoryDataVersion != LocalCategoriesTableDataVersion)
                {
                    RemoveTableData(locker);//remove old data from category table
                    PopulateTableDataFromServer(locker);
                    LocalCategoriesTableDataVersion = serverCategoryDataVersion;//update localCategoryVersion
                }
            }
            else
            {
                //TODO error in getting data from server
            }
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [Categories](
                                      categoryId int PRIMARY KEY,
                                      categoryName ntext,
                                      categoryParentId int,
                                      categoryNameEnglish ntext
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
        public Category[] GetAll(object locker)
        {
            List<Category> allCategories = new List<Category>();
            Category tempCategory;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [categoryId],[categoryName],[categoryParentId],[categoryNameEnglish] FROM [Categories]";
                    var r = sqliteCommand.ExecuteReader();
                    while (r.Read())
                    {
                        tempCategory = new Category((int) r["categoryId"],
                            (int)r["categoryParentId"],
                            r["categoryName"].ToString(),
                            r["categoryNameEnglish"].ToString());
                        allCategories.Add(tempCategory);
                    }
                }
                connection.Close();
            }
            return allCategories.ToArray();
        }
        public async Task PopulateTableDataFromServer(object locker)
        {
            string commandText = @"INSERT INTO [Categories] 
                                   ([categoryId], [categoryName],[categoryParentId],[categoryNameEnglish])
                                   VALUES (@categoryId, @categoryName,@categoryParentId,@categoryNameEnglish)";
            CategoryApi categoryApi = new CategoryApi();
            ResponseBase<Category[]> response =await categoryApi.GetAllCategories();

            if (response.Success)
            {
                lock (locker)
                {
                    connection.Open();
                    foreach (Category category in response.ResponseData)
                    {
                        using (SqliteCommand c = connection.CreateCommand())
                        {
                            c.CommandText = commandText;
                            c.Parameters.Add("categoryId", DbType.Int32).Value = category.CategoryId;
                            c.Parameters.Add("categoryName", DbType.String).Value = category.CategoryName;
                            c.Parameters.Add("categoryParentId", DbType.Int32).Value = category.ParentCategoryId;
                            c.Parameters.Add("categoryNameEnglish", DbType.String).Value = category.EnglishCategoryName;
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
            string commandText = "delete  from [Categories]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }

        //called for putting selected category ids to be send to server
        public KeyValuePair<string,string> GetCategoryIdDictionary()
        {
            return new KeyValuePair<string, string>(CategoryIdKey, prefs.GetString(CategoryIdKey, defaultCategoryId));
        }
    }
}