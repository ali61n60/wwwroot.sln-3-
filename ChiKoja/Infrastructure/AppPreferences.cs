using Android.App;
using Android.Content;

namespace ChiKoja.Infrastructure
{
    public class AppPreferences
    {
        public static int SearchPrefChangedNumber { get;private set; }

        private static readonly ISharedPreferences _searchPreferences =Application.Context.GetSharedPreferences("Search", FileCreationMode.Private);
        private static readonly ISharedPreferences _databasePreferences = Application.Context.GetSharedPreferences("Database", FileCreationMode.Private);
        public static void SetSearchPref(string key, string value)
        {
            string oldValue = _searchPreferences.GetString(key, "oldValue");
            if (oldValue == "oldValue" || oldValue != value)
            {
                SearchPrefChangedNumber++;
                ISharedPreferencesEditor editor = _searchPreferences.Edit();
                editor.PutString(key, value);
                editor.Commit();
            }
        }

        public static string GetSearchPref(string key,string defaultValue)
        {
            return _searchPreferences.GetString(key, defaultValue);
        }

        public static void ResetSearchPreferences()
        {
            _searchPreferences.Edit().Clear().Commit();
        }

        public static void SetDatabasePref(string key, string value)
        {
            ISharedPreferencesEditor editor = _databasePreferences.Edit();
            editor.PutString(key, value);
            editor.Commit();
        }

        public static string GetDatabasePref(string key, string defaultValue)
        {
            return _databasePreferences.GetString(key, defaultValue);
        }

        public static void ResetDatabsePreferences()
        {
            _databasePreferences.Edit().Clear().Commit();
        }

    }
}