using System;
using Android.App;
using Android.Content;
using Android.Preferences;
using ChiKoja.Services.Server;
using ModelStd.Services;


namespace ChiKoja.Repository
{
    //TODO make registration Token base
    public class Registration
    {
        ISharedPreferences prefs;
        readonly RegistrationApi _registrationApi;
        private readonly string userNameKey = "userNameKey";
        private readonly string defaultUserName = "NoUser";
        
        private readonly string passwordKey = "passwordKey";
        private readonly string defaultPassword = "NoPass";

        private readonly string userLoggedInKey = "userLoggedInKey";
        private readonly bool userLoggedInDefault = false;


        public Registration()
        {
            prefs = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
            _registrationApi = new RegistrationApi();
        }
        public bool Login(string userName, string password)
        {
           // ResponseBase response;
           // try
           // {
               // response = _registrationApi.ValidateUser(userName, password);
              //  if (response.Success)
               // {
               //     saveUserAndPassInPreference(userName, password);
                    return true;
               // }
             //   return false;
           // }
          //  catch (Exception ex)
           // {
                return false;
          //  }
        }

        private void saveUserAndPassInPreference(string userName,string password)
        {
            ISharedPreferencesEditor editor = prefs.Edit();
            editor.PutString(userNameKey, userName);
            editor.PutString(passwordKey, password);
            editor.PutBoolean(userLoggedInKey, true);
            editor.Commit();
        }

        public void SignIn(string userName, string password,string phoneNumber)
        {
            //TODO call server and create new user  and if Ok
            //TODO create new thread for service call 
          //  ResponseBase response= _registrationApi.CreateNewUser(userName, password, phoneNumber);//get user phone number
            //if (response.Success)
           // {
            //    saveUserAndPassInPreference(userName, password);
           // }
        }

        public void LogOut()
        {
            ISharedPreferencesEditor editor = prefs.Edit();
            editor.Remove(userNameKey);
            editor.Remove(passwordKey);
            editor.Remove(userLoggedInKey);
            editor.Commit();
        }

        public string UserName
        {
            get { return prefs.GetString(userNameKey, defaultUserName); }
        }
        public string Password
        {
            get { return prefs.GetString(passwordKey, defaultPassword); }
        }
        public bool IsUserLoggedIn
        {
            get { return prefs.GetBoolean(userLoggedInKey, userLoggedInDefault); }
        }
       
    }
}