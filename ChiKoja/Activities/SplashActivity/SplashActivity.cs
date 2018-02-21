using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using ChiKoja.Activities.SearchAd;
using ChiKoja.Infrastructure;
using ChiKoja.Infrastructure.IOC;
using ChiKoja.NavigationDrawer;


namespace ChiKoja.Activities.SplashActivity
{
    [Activity(Theme = "@style/Theme.Main", MainLauncher = true, NoHistory = true)]
    public class SplashActivity : NavActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.splash_screen);

            Task.Run(() => checkDatabase());

            resetSearchFilter();
        }

        private void checkDatabase()
        {
            Task.Run(async () =>
            {
                Repository.Repository repository = Bootstrapper.container.GetInstance<Repository.Repository>();
                await repository.ManageDatabaseFile(GlobalApplication.GlobalApp.GetGlobalApp(),
                    GlobalApplication.GlobalApp.ManageDatabaseRequestCode);
                RunOnUiThread(() =>
                {

                });
            }).Wait();
        }
        protected override async void OnResume()
        {
            base.OnResume();
            await Task.Delay(10);//Simulate startup work
            StartActivity(new Intent(Application.Context, typeof(SearchAdActivity)));
            
        }

        private void resetSearchFilter()
        {
            AppPreferences.ResetSearchPreferences();
        }
    }
}