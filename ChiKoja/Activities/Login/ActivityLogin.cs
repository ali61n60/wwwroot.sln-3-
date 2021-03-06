using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository;

namespace ChiKoja.Login
{
    [Activity(Label = "ActivityLogin", Theme = "@style/Theme.Main")]
    public class ActivityLogin : NavActivity
    {
        Registration registration;

        AppCompatButton buttonOk;
        AppCompatButton buttonCancel;
        AppCompatButton buttonSignIn;
        AppCompatButton buttonLogout;
        AppCompatEditText editTextUserName;
        AppCompatEditText editTextPassword;
        AppCompatTextView textViewMessage;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.login);
            registration = new Registration();
            initialViews();
            checkLoginStatusAndPoulateEditTextsIfNedded();
        }
        
        private void initialViews()
        {
            buttonOk = FindViewById<AppCompatButton>(Resource.Id.buttonOk);
            buttonOk.Click += buttonOk_Click;
            buttonCancel = FindViewById<AppCompatButton>(Resource.Id.buttonCancel);
            buttonCancel.Click += buttonCancel_Click;
            buttonSignIn = FindViewById<AppCompatButton>(Resource.Id.buttonSignIn);
            buttonSignIn.Click += buttonSignIn_Click;
            buttonLogout = FindViewById<AppCompatButton>(Resource.Id.buttonLogout);
            buttonLogout.Click += buttonLogout_Click;
            editTextUserName = FindViewById<AppCompatEditText>(Resource.Id.editTextUserName);
            editTextPassword = FindViewById<AppCompatEditText>(Resource.Id.editTextPassword);
            textViewMessage = FindViewById<AppCompatTextView>(Resource.Id.textViewMessage);
        }
        private void checkLoginStatusAndPoulateEditTextsIfNedded()
        {
            if (registration.IsUserLoggedIn)
            {
                editTextUserName.Text = registration.UserName;
                editTextPassword.Text = registration.Password;
                textViewMessage.Text = Resources.GetString(Resource.String.AlreadySignInMessage);
            }
        }

        void buttonLogout_Click(object sender, EventArgs e)
        {
            registration.LogOut();
            textViewMessage.Text = "Logged out";//TODO save message in resource
        }

        void buttonSignIn_Click(object sender, EventArgs e)
        {
            Intent signIntent=new Intent(this,typeof(ActivitySignIn));
            StartActivity(signIntent);
            Finish();
        }

        void buttonCancel_Click(object sender, EventArgs e)
        {
            SetResult(Result.Canceled);
            Finish();
        }

        void buttonOk_Click(object sender, EventArgs e)
        {
            //TODO show progress dialog until server call ends
            bool loggedIn= registration.Login(editTextUserName.Text,editTextPassword.Text);
            //TODO dismiss progress dialog
            if (loggedIn)
            {
                SetResult(Result.Ok);
                Finish(); 
            }
            else
            {
                //TODO show error message to user not logged in
            }
            
        }
    }
}