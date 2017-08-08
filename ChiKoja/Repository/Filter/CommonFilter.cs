using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Preferences;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.AdCommonService;

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

        public readonly string OrderByKey = "OrderBy";
        public const string OrderByDateAsc = "DateAsc";
        public const string OrderByDateDesc = "DateDesc";
        public const string OrderByPriceAsc = "PriceAsc";
        public const string OrderByPriceDesc = "PriceDesc";

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
            editor.Remove(OrderByKey);
            editor.Commit();
        }

        public float MinimumPrice
        {
            get { return prefs.GetFloat(MinimumPriceKey, MinimumPriceDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutFloat(MinimumPriceKey, value);
                editor.Commit();
            }
        }

        public float MaximumPrice
        {
            get { return prefs.GetFloat(MaximumPriceKey, MaximumPriceDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutFloat(MaximumPriceKey, value);
                editor.Commit();
            }
        }

        public bool OnlyWithPictures
        {
            get { return prefs.GetBoolean(OnlyWithPicturesKey, OnlyWithPicturesDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutBoolean(OnlyWithPicturesKey, value);
                editor.Commit();
            }
        }

        public string OrderBy
        {
            get { return prefs.GetString(OrderByKey, OrderByDateAsc); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutString(OrderByKey, value);
                editor.Commit();
            }
        }

        public bool UrgentAdsOnly
        {
            get { return prefs.GetBoolean(UrgentAdsOnlyKey, UrgentAdsOnlyDefault); }
            set
            {
                ISharedPreferencesEditor editor = prefs.Edit();
                editor.PutBoolean(UrgentAdsOnlyKey, value);
                editor.Commit();
            }
        }

        public void InsertSearchFilters(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            insertMinimumPrice(userInput);
            insertMaximumPrice(userInput);
            insertOnlyWithPictures(userInput);
            insertUrgentAdsOnly(userInput);
            insertOrderBy(userInput);
        }

        private void insertMinimumPrice(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            ArrayOfKeyValueOfstringstringKeyValueOfstringstring MinimumPriceUserInput =
                new ArrayOfKeyValueOfstringstringKeyValueOfstringstring();
            MinimumPriceUserInput.Key = MinimumPriceKey;
            MinimumPriceUserInput.Value = ((decimal) MinimumPrice).ToString();
            userInput.Add(MinimumPriceUserInput);
        }

        private void insertMaximumPrice(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            ArrayOfKeyValueOfstringstringKeyValueOfstringstring MaximumPriceUserInput =
                new ArrayOfKeyValueOfstringstringKeyValueOfstringstring();
            MaximumPriceUserInput.Key = MaximumPriceKey;
            MaximumPriceUserInput.Value = ((decimal) MaximumPrice).ToString();
            userInput.Add(MaximumPriceUserInput);
        }

        private void insertOnlyWithPictures(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            if(OnlyWithPictures)
            {
                ArrayOfKeyValueOfstringstringKeyValueOfstringstring OnlyWithPicturesUserInput =
                new ArrayOfKeyValueOfstringstringKeyValueOfstringstring();
                OnlyWithPicturesUserInput.Key = OnlyWithPicturesKey;
                OnlyWithPicturesUserInput.Value = OnlyWithPictures.ToString();
                userInput.Add(OnlyWithPicturesUserInput);
            }
        }

        private void insertUrgentAdsOnly(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            if (UrgentAdsOnly)
            {
                ArrayOfKeyValueOfstringstringKeyValueOfstringstring UrgentAdsOnlyUserInput = new ArrayOfKeyValueOfstringstringKeyValueOfstringstring();
                UrgentAdsOnlyUserInput.Key = UrgentAdsOnlyKey;
                UrgentAdsOnlyUserInput.Value = Urgent.ToString();
                userInput.Add(UrgentAdsOnlyUserInput);
            }
        }

         private void insertOrderBy(List<ArrayOfKeyValueOfstringstringKeyValueOfstringstring> userInput)
        {
            ArrayOfKeyValueOfstringstringKeyValueOfstringstring OrderByUserInput = new ArrayOfKeyValueOfstringstringKeyValueOfstringstring();
            OrderByUserInput.Key = OrderByKey;
            OrderByUserInput.Value = OrderBy;
            userInput.Add(OrderByUserInput);
        }
    }
}