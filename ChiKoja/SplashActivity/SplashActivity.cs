using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository.Filter;
using ChiKoja.SearchAd;

namespace ChiKoja.SplashActivity
{
    [Activity(Theme = "@style/Theme.Splash", MainLauncher = true, NoHistory = true)]
    public class SplashActivity : NavActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            checkDatabase();
            resetSearchFilter();
        }
        private async void checkDatabase()
        {
            Repository.Repository repository = Bootstrapper.container.GetInstance<Repository.Repository>();
            await repository.ManageDatabaseFile(GlobalApplication.GlobalApplication.GetGlobalApplication(),
                GlobalApplication.GlobalApplication.GetGlobalApplication().ManageDatabaseRequestCode);
        }
        private void resetSearchFilter()
        {
            CommonFilter commonFilter = new CommonFilter();
            commonFilter.ResetCommonFilter();
        }
        protected override void OnResume()
        {
            base.OnResume();

            Task startupWork = new Task(() =>
            {
                Task.Delay(10);  // Simulate a bit of startup work.
            });
            startupWork.ContinueWith(t =>
            {
                StartActivity(new Intent(Application.Context, typeof(SearchAdActivity)));
            }, TaskScheduler.FromCurrentSynchronizationContext());

            startupWork.Start();
        }
    }
}