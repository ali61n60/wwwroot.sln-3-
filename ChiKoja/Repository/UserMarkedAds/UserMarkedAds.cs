using System;
using System.Collections.Generic;
using System.Data;
using Mono.Data.Sqlite;

namespace ChiKoja.Repository.UserMarkedAds
{
    public class UserMarkedAds
    {
        private readonly SqliteConnection connection;

        public UserMarkedAds(string databasePath)
        {
            connection = new SqliteConnection("Data Source=" + databasePath);
        }
        public void CreateTable(object locker)
        {
            string commandText = @"CREATE TABLE [UserMarkedAds](
                                      adGuid GUID PRIMARY KEY                                      
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
        public Guid[] GetAllMarkedAds(object locker)
        {
            List<Guid> allMarkedAds = new List<Guid>();
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT [adGuid] FROM [UserMarkedAds]";
                    var r = sqliteCommand.ExecuteReader();
                    while (r.Read())
                    {
                        Guid tempGuid = (Guid)r["adGuid"];
                        allMarkedAds.Add(tempGuid);
                    }
                }
                connection.Close();
            }
            return allMarkedAds.ToArray();
        }
        public void RemoveTableData(object locker)
        {
            string commandText = "delete  from [UserMarkedAds]";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }
        public bool IsAdMarked(object locker, Guid adGuid)
        {
            bool isAdMarked = false;
            lock (locker)
            {
                connection.Open();
                using (SqliteCommand sqliteCommand = connection.CreateCommand())
                {
                    sqliteCommand.CommandText =
                        "SELECT count(*) AS numberOfAdGuid FROM [UserMarkedAds] WHERE adGuid=@adGuid";
                    sqliteCommand.Parameters.Add("adGuid", DbType.Guid).Value = adGuid;
                    var r = sqliteCommand.ExecuteReader();
                    if (r.Read())
                    {
                        long numberOfAdGuid =(long) r["numberOfAdGuid"];
                        
                        if (numberOfAdGuid > 0)
                            isAdMarked = true;
                    }
                }
                connection.Close();
            }
            return isAdMarked;
        }
        public void MarkAd(object locker, Guid adGuid)
        {
            if(IsAdMarked(locker,adGuid))// ad already is marked
                return;
            string commandText = @"INSERT INTO [UserMarkedAds] 
                                   ([adGuid])
                                   VALUES (@adGuid)";
            lock (locker)
            {
                connection.Open();
                try
                {
                    using (SqliteCommand c = connection.CreateCommand())
                    {
                        c.CommandText = commandText;
                        c.Parameters.Add("adGuid", DbType.Guid).Value = adGuid;
                        var rowcount = c.ExecuteNonQuery();
                    }
                }
                catch (Exception ex)
                {
                    //TODO report error to users
                }

                connection.Close();
            }
        }
        
        public void UnmarAd(object locker, Guid adGuid)
        {
            string commandText = "delete  from [UserMarkedAds] WHERE adGuid=@adGuid";
            lock (locker)
            {
                connection.Open();
                SqliteCommand command = connection.CreateCommand();
                command.CommandText = commandText;
                command.Parameters.Add("adGuid", DbType.Guid).Value = adGuid;
                int rowCount = command.ExecuteNonQuery();
                connection.Close();
            }
        }
    }
}