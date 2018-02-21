using System.Collections.Generic;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Activities.SearchAd.SearchFilter;
using ChiKoja.Infrastructure.IOC;
using ModelStd.Db.Ad;
using ModelStd.Services;

namespace ChiKoja.Repository.Filter
{
    public class CommonFilter
    {
        ISharedPreferences prefs;
        private readonly string MinimumPriceKey = "MinimumPrice";
        public readonly float MinimumPriceDefault = 0.0f;
        private readonly string MaximumPriceKey = "MaximumPrice";
        public readonly float MaximumPriceDefault = 10000000000.0f;
        private readonly string OnlyWithPicturesKey = "OnlyWithPictures";
        public readonly bool OnlyWithPicturesDefault = false;
        private readonly string UrgentAdsOnlyKey = "UrgentAdsOnly";
        public readonly bool UrgentAdsOnlyDefault = false;
        private readonly int NoPrivilege = 1;
        private readonly int Urgent = 2;
        private readonly int EmailOthers = 3;
        private readonly int SMSOthers = 4;

       

        public CommonFilter()
        {
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
        }

        public void ResetCommonFilter()
        {
            ISharedPreferencesEditor editor = prefs.Edit();
            
            editor.Remove(MinimumPriceKey);
            editor.Remove(MaximumPriceKey);
            editor.Remove(OnlyWithPicturesKey);
            editor.Remove(UrgentAdsOnlyKey);
            editor.Remove(OrderByHelper.OrderByKey);
            editor.Commit();
        }

        public float MinimumPrice
        {
            get => prefs.GetFloat(MinimumPriceKey, MinimumPriceDefault);
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutFloat(MinimumPriceKey, value);
                editor.Commit();
            }
        }

        public float MaximumPrice
        {
            get => prefs.GetFloat(MaximumPriceKey, MaximumPriceDefault);
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutFloat(MaximumPriceKey, value);
                editor.Commit();
            }
        }

        public bool OnlyWithPictures
        {
            get => prefs.GetBoolean(OnlyWithPicturesKey, OnlyWithPicturesDefault);
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutBoolean(OnlyWithPicturesKey, value);
                editor.Commit();
            }
        }

        public string OrderBy
        {
            get => prefs.GetString(OrderByHelper.OrderByKey, OrderByHelper.OrderByDefault.ToString());
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutString(OrderByHelper.OrderByKey, value);
                editor.Commit();
            }
        }

        public bool UrgentAdsOnly
        {
            get => prefs.GetBoolean(UrgentAdsOnlyKey, UrgentAdsOnlyDefault);
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutBoolean(UrgentAdsOnlyKey, value);
                editor.Commit();
            }
        }

        public void InsertSearchFilters(Dictionary<string,string> userInput)
        {
            insertMinimumPrice(userInput);
            insertMaximumPrice(userInput);
            insertOnlyWithPictures(userInput);
            insertUrgentAdsOnly(userInput);
            insertOrderBy(userInput);
        }

        private void insertMinimumPrice(Dictionary<string, string> userInput)
        {
            userInput[MinimumPriceKey]= ((decimal)MinimumPrice).ToString();
        }

        private void insertMaximumPrice(Dictionary<string, string> userInput)
        {
            userInput[MaximumPriceKey] = ((decimal)MaximumPrice).ToString(); 
        }

        private void insertOnlyWithPictures(Dictionary<string, string> userInput)
        {
            if(OnlyWithPictures)
            {
                userInput[OnlyWithPicturesKey] = OnlyWithPictures.ToString(); 
            }
        }

        private void insertUrgentAdsOnly(Dictionary<string, string> userInput)
        {
            if (UrgentAdsOnly)
            {
                userInput[UrgentAdsOnlyKey] = Urgent.ToString();
            }
        }

         private void insertOrderBy(Dictionary<string, string> userInput)
        {
            userInput[OrderByHelper.OrderByKey]=OrderBy;
        }

        public void FillUserInputSearchFilter(Dictionary<string, string> userInputDictionary)
        {
            //TODO fill categoryId
            int categoryId= prefs.GetInt(Category.CategoryIdKey, Category.CategoryIdDefault);
            userInputDictionary.Add(Category.CategoryIdKey,categoryId.ToString());//check for duplicate
            userInputDictionary.Add(Category.CategoryIdKey, categoryId.ToString());//check for duplicate

            SearchFilterCategorySpecificBaseCriteria searchFilterCategorySpecific= AdViewContainer.GetCategorySpecificSearchFilterViewFragment(categoryId);
            searchFilterCategorySpecific.FillCategorySpecificUserInputSearchFilter(userInputDictionary);
            //based on categoryId fill other parameters
        }
    }
}