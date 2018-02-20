using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using ChiKoja.Activities.SearchAd;
using ChiKoja.Infrastructure;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository.Filter;

namespace ChiKoja.Activities.SplashActivity
{
    [Activity(Theme = "@style/Theme.Main", MainLauncher = true, NoHistory = true)]
    public class SplashActivity : NavActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.splash_screen);
           
            checkDatabase();
            resetSearchFilter();
        }

        //TODO I do not understand this. It must be run in a background proccess not in async
        private async void checkDatabase()
        {
            Repository.Repository repository = Bootstrapper.container.GetInstance<Repository.Repository>();
            await repository.ManageDatabaseFile(GlobalApplication.GlobalApp.GetGlobalApplication(),
                GlobalApplication.GlobalApp.GetGlobalApplication().ManageDatabaseRequestCode);
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

        private void resetSearchFilter()
        {
            AppPreferences.ResetSearchPreferences();
        }
    }
}