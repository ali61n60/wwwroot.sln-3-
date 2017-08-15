﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using Microsoft.Extensions.Configuration;

//
//using System.Web.UI;

namespace RepositoryStd
{
    public class AdvertisementDataClass
    {
        //public static string GetConnectionString()
        //{
        //    string exeConfigPath = System.Reflection.Assembly.GetEntryAssembly().Location;
        //    string path = Path.GetDirectoryName(exeConfigPath);
        //    //TODO get it from configFile
        //    //return
        //    //    "Data Source= .\\;Initial Catalog=ayoobfar_db;Persist Security Info=True;User ID=ayoobfar_ali;Password=119801;MultipleActiveResultSets=true";


        //    IConfiguration configuration = new ConfigurationBuilder().AddJsonFile(path+Path.DirectorySeparatorChar+"appsettings.json").Build();
        //    return configuration["Data:ConnectionString"];
        //}
       
        //Move
        /// <summary>
        /// calculate time passed and return appropriate string
        /// </summary>
        /// <param name="adTime"></param>
        /// <returns></returns>
        private static string SetAdTimeText(DateTime adTime)
        {

            string returnString = "";
            // currentTime = currentTime.AddYears(10);

            TimeSpan timeDiff = DateTime.Now.Subtract(adTime);
            if (timeDiff.Days >= 365)//greater than 1 year
            {
                int hours = timeDiff.Hours;
                int days = timeDiff.Days;
                int year = (int)(timeDiff.Days / 365);
                days = days - year * 365;
                returnString = "زمان آگهی " + year.ToString() + " سال , " + days.ToString() + " " + " روز پیش ";
            }
            else if (timeDiff.Days >= 1)//greater than 1 day
            {
                int hours = timeDiff.Hours;
                int days = timeDiff.Days;
                returnString = "زمان آگهی " + days.ToString() + " " + " روز پیش ";
            }
            else if (timeDiff.Hours >= 1)//greater than 1 hour
            {
                int hours = timeDiff.Hours;
                returnString = "زمان آگهی " + hours.ToString() + " " + " ساعت پیش ";
            }
            else if (timeDiff.Minutes >= 30)//greater than 30 minutes
            {
                returnString = "کمتر از یک ساعت پیش";
            }
            else if (timeDiff.Minutes >= 15)//greater than 15 minutes
            {
                returnString = "کمتر از نیم ساعت پیش";
            }
            else//less than 15 minutes
            {
                returnString = "کمتر از یک ربع پیش";
            }
            return returnString;
        }
    }
}
