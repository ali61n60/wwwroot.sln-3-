using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Widget;
using ChiKoja.NavigationDrawer;
using ServiceLayer;

namespace ChiKoja.NewAd
{
    [Activity(Label = "ActivityNewAd")]
    public class ActivityNewAd : NavActivity
    {
        //TODO take category
        //based on selected category get specific data from user
        //take ad location
        //submit ad to server
        //TODO based on catgoryId of Ad call service method
        //TODO refactor code and use local service layer

        AppCompatButton buttonSelectSpecificCategory;
        AppCompatEditText editTextSelectedCategoryId;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.new_ad);

            buttonSelectSpecificCategory = FindViewById<AppCompatButton>(Resource.Id.buttonSelectSpecificCategory);
            buttonSelectSpecificCategory.Click += buttonSelectSpecificCategory_Click;

            editTextSelectedCategoryId = FindViewById<AppCompatEditText>(Resource.Id.editTextCategoryId);
        }

       
        void buttonSelectSpecificCategory_Click(object sender, EventArgs e)
        {
            //TODO select category from catgories in Category Table
            int selectedCategoryId = Parser.ParseInt(editTextSelectedCategoryId.Text, 100);
            dispatchNewAdBasedOnCategoryId(selectedCategoryId);
        }

        private void dispatchNewAdBasedOnCategoryId(int categoryId)
        {
            switch (categoryId)
            {
                case 100:
                    Android.Content.Intent intentNewAdTransportation = new Intent(Application.Context,
                        typeof (ActivityNewAdTransportation));
                    StartActivity(intentNewAdTransportation);
                    Finish();
                    break;
                default:
                    //TODO tell user selected category id has no activity asociated
                    break;
            }
        }
    }
}