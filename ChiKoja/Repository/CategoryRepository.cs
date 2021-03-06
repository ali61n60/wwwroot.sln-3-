﻿using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using ChiKoja.Infrastructure;
using ChiKoja.Services.Server;
using ModelStd.Services;
using Mono.Data.Sqlite;
using ModelStd.Db.Ad;

namespace ChiKoja.Repository
{
    public class CategoryRepository:ILocalTable
    {
        
        private readonly SqliteConnection connection;
        public int OperationOrder { get; private set; }

        private readonly string LocalCategoryDataVersionKey = "LocalCategoryDataVersion";
        private readonly int LocalCategoryDataVersionDefault = -1;
        public int LocalCategoriesTableDataVersion
        {
            get => int.Parse(AppPreferences.GetDatabasePref(LocalCategoryDataVersionKey,LocalCategoryDataVersionDefault.ToString()));
            set => AppPreferences.SetDatabasePref(LocalCategoryDataVersionKey, value.ToString());
        }
        
        public int CategoryId
        {
            get =>int.Parse(AppPreferences.GetSearchPref(Category.CategoryIdKey, Category.CategoryIdDefault.ToString()));
            set=>AppPreferences.SetSearchPref(Category.CategoryIdKey, value.ToString());
        }
        public CategoryRepository(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
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
                        tempCategory = new Category();
                        tempCategory.CategoryId = (int) r["categoryId"];
                        tempCategory.CategoryParentId= (int) r["categoryParentId"];
                        tempCategory.CategoryName= r["categoryName"].ToString();
                        tempCategory.CategoryNameEnglish = r["categoryNameEnglish"].ToString();
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
                            c.Parameters.Add("categoryParentId", DbType.Int32).Value = category.CategoryParentId;
                            c.Parameters.Add("categoryNameEnglish", DbType.String).Value = category.CategoryNameEnglish;
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

        public int GetSelectedCategoryId()
        {
            return int.Parse(AppPreferences.GetSearchPref(Category.CategoryIdKey,Category.CategoryIdDefault.ToString()));
        }
    }
}