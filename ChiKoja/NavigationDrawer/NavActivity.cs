using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.Design.Widget;
using Android.Support.V4.Widget;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Android.Widget;
using ChiKoja.Activities.SearchAd;
using ChiKoja.LocationSelection;
using ChiKoja.Login;
using ChiKoja.NewAd;
using ChiKoja.SearchAd;
using ChiKoja.SearchAd.UserAd;
using ChiKoja.Utility;
using AlertDialog = Android.Support.V7.App.AlertDialog;
using V7Toolbar = Android.Support.V7.Widget.Toolbar;


namespace ChiKoja.NavigationDrawer
{
    [Activity(Label = "Leftdrawerlayout", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class NavActivity : AppCompatActivity
    {
        public const int LocationSelectionRequestCode = 1;
        public const int SearchFilterRequestCode = 3;
        public const int OrderByRequestCode=4;

        DrawerLayout drawerLayout;
        private const int navigationGravity = Android.Support.V4.View.GravityCompat.End;

        
        V7Toolbar toolbar;
        protected NavigationView NavigationView;
        AppCompatTextView textViewMessage;
        ScreenUtility _screenUtility;
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            SetContentView(Resource.Layout.main);
            _screenUtility = new ScreenUtility(this);
            initializeToolbar();
            initializeNavigationView();
            GlobalApplication.GlobalApplication.GetMessageShower().CurrentNavActivity = this;
        }

        private void initializeToolbar()
        {
            toolbar = FindViewById<V7Toolbar>(Resource.Id.toolbar);
            SetSupportActionBar(toolbar);
            initializeSandwichIcon();
            textViewMessage = FindViewById<AppCompatTextView>(Resource.Id.textViewMessage);

            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            SupportActionBar.SetDisplayShowTitleEnabled(false);
            SupportActionBar.SetHomeButtonEnabled(true);
            SupportActionBar.SetHomeAsUpIndicator(Resource.Drawable.icon);
            drawerLayout = FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
        }

        private void initializeSandwichIcon()
        {
            AppCompatImageView imageViewMenu = toolbar.FindViewById<AppCompatImageView>(Resource.Id.imageViewMenu);
            imageViewMenu.Click += imageViewMenu_Click;
        }

        private void initializeNavigationView()
        {
            NavigationView = FindViewById<NavigationView>(Resource.Id.nav_view);
            NavigationView.LayoutParameters.Width = setNavigationDrawerWidth();
            NavigationView.NavigationItemSelected += navigationView_NavigationItemSelected;
        }

        private int setNavigationDrawerWidth()
        {
            float width = _screenUtility.GetWidth() * _screenUtility.GetDensity();
            return (int)(width * Resources.GetInteger(Resource.Integer.NavigationDrawerWidthPercent) * 0.01);
        }

        void imageViewMenu_Click(object sender, System.EventArgs e)
        {
            toggleDrawer();
        }

        private void toggleDrawer()
        {
            if (drawerLayout.IsDrawerOpen(navigationGravity))
                drawerLayout.CloseDrawer(navigationGravity);
            else
                drawerLayout.OpenDrawer(navigationGravity);
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            switch (item.ItemId)
            {
                case Android.Resource.Id.Home:
                    toggleDrawer();
                    return true;
            }
            return base.OnOptionsItemSelected(item);
        }

        void navigationView_NavigationItemSelected(object sender, NavigationView.NavigationItemSelectedEventArgs e)
        {
            switch (e.MenuItem.ItemId)
            {
                case Resource.Id.nav_home:
                    navHomeClicked();
                    break;
               case Resource.Id.nav_LocationSelection:
                    navLocationSelectionClicked();
                    break;
                case Resource.Id.nav_synchDatabase:
                    navSynchDatabaseClicked();
                    break;
                case Resource.Id.nav_newAd:
                    navNewAdClicked();
                    break;
                case Resource.Id.nav_login_logout:
                    navLoginLogoutClicked();
                    break;
                case Resource.Id.nav_myAds:
                    navMyAdsClicked();
                    break;
                case Resource.Id.ScreenDimension:
                    showDimensionDialog();
                    break;
                case Resource.Id.nav_exitApp:
                    navExitAppClicked();
                    break;
            }
        }

        private void showDimensionDialog()
        {
            ScreenUtility screenUtility=new ScreenUtility(this);
            string output = "Width:" + screenUtility.GetWidth() + " , Height:" + screenUtility.GetHeight();
            AlertDialog.Builder builder=new AlertDialog.Builder(this);
            builder.SetTitle("Dimension")
                .SetMessage(output)
                .Create()
                .Show();

        }
        private void navSynchDatabaseClicked()
        {
            
        }

        private void navHomeClicked()
        {
            Intent homeIntent = new Intent(this, typeof(SearchAdActivity));
            homeIntent.SetFlags(ActivityFlags.ClearTop);
            StartActivity(homeIntent);
        }
        private void navLocationSelectionClicked()
        {
            Intent locationSelectionIntent = new Intent(this, typeof(ActivityLocationSelection));
            StartActivityForResult(locationSelectionIntent, LocationSelectionRequestCode);
        }
        
        private void navNewAdClicked()
        {
            Intent newAdIntent = new Intent(this, typeof(ActivityNewAd));
            StartActivity(newAdIntent);
        }
        private void navLoginLogoutClicked()
        {
            Intent loginIntent = new Intent(this, typeof(ActivityLogin));
            StartActivity(loginIntent);
        }
        private void navMyAdsClicked()
        {
            Intent myAdIntent = new Intent(this, typeof(ActivityUserAds));
            StartActivity(myAdIntent);
        }
        private void navExitAppClicked()
        {
            Intent intent = new Intent(ApplicationContext, typeof(SearchAdActivity));
            intent.SetFlags(ActivityFlags.ClearTop);
            intent.PutExtra("EXIT", true);
            StartActivity(intent);
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);
            drawerLayout.CloseDrawer(navigationGravity);
        }

        public virtual void ShowMessage(string message)
        {
            RunOnUiThread(() =>
            {
                textViewMessage.Text = message;
            });
        }
    }
}
