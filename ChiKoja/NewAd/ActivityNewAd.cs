using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using ChiKoja.AdTransportationService;
using ChiKoja.Repository;
using ChiKoja.Repository.CryptoGraphy;
using ServiceLayer;
using ResponseBase = ChiKoja.AdTransportationService.ResponseBase;

namespace ChiKoja.NewAd
{
    [Activity(Label = "ActivityNewAd")]
    public class ActivityNewAd : Activity
    {
        //TODO take category
        //based on selected category get specific data from user
        //take ad location
        //submit ad to server
        //TODO based on catgoryId of Ad call service method
        //TODO refactor code and use local service layer

        Button buttonSelectSpecificCategory;
        EditText editTextSelectedCategoryId;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.NewAd);

            buttonSelectSpecificCategory = FindViewById<Button>(Resource.Id.buttonSelectSpecificCategory);
            buttonSelectSpecificCategory.Click += buttonSelectSpecificCategory_Click;

            editTextSelectedCategoryId = FindViewById<EditText>(Resource.Id.editTextCategoryId);
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