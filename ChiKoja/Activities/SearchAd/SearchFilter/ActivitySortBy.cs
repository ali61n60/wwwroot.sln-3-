using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Widget;
using ChiKoja.Repository.Filter;

namespace ChiKoja.SearchAd
{
    [Activity(Label = "ActivitySortBy", Theme = "@style/Theme.Main", Icon = "@drawable/icon")]
    public class ActivitySortBy : AppCompatActivity
    {
        CommonFilter commonFilter;
        AppCompatButton buttonReturn;
        AppCompatRadioButton radioButtonDateAsc;
        AppCompatRadioButton radioButtonDateDesc;
        AppCompatRadioButton radioButtonPriceAsc;
        AppCompatRadioButton radioButtonPriceDesc;
        private bool OrderByParameterChangedByUser = false;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            inflateView();
            initializeFields();
            updateFieldsFromSavedPreferences();
        }
        private void inflateView()
        {
            SetContentView(Resource.Layout.sort_by);
        }

        private void initializeFields()
        {
            commonFilter = new CommonFilter();
            buttonReturn = FindViewById<AppCompatButton>(Resource.Id.buttonReturn);
            buttonReturn.Click += buttonReturn_Click;
            radioButtonDateAsc = FindViewById<AppCompatRadioButton>(Resource.Id.radioButtonDateAsc);
            radioButtonDateAsc.CheckedChange+=radioButtons_CheckedChange;
            radioButtonDateDesc = FindViewById<AppCompatRadioButton>(Resource.Id.radioButtonDateDesc);
            radioButtonDateDesc.CheckedChange += radioButtons_CheckedChange;
            radioButtonPriceAsc = FindViewById<AppCompatRadioButton>(Resource.Id.radioButtonPriceAsc);
            radioButtonPriceAsc.CheckedChange += radioButtons_CheckedChange;
            radioButtonPriceDesc = FindViewById<AppCompatRadioButton>(Resource.Id.radioButtonPriceDesc);
            radioButtonPriceDesc.CheckedChange += radioButtons_CheckedChange;
        }

        private void radioButtons_CheckedChange(object sender, CompoundButton.CheckedChangeEventArgs e)
        {
            OrderByParameterChangedByUser = true;
            if (radioButtonDateAsc.Checked)
            {
                commonFilter.OrderBy = CommonFilter.OrderByDateAsc;
            }
            else if (radioButtonDateDesc.Checked)
            {
                commonFilter.OrderBy = CommonFilter.OrderByDateDesc;
            }
            else if(radioButtonPriceAsc.Checked)
            {
                commonFilter.OrderBy = CommonFilter.OrderByPriceAsc;
            }
            else if (radioButtonPriceDesc.Checked)
            {
                commonFilter.OrderBy = CommonFilter.OrderByPriceDesc;
            }
        }

        private void buttonReturn_Click(object sender, EventArgs e)
        {
            Intent data = new Intent();
            data.PutExtra("OrderByChanged", OrderByParameterChangedByUser);
            SetResult(Result.Ok, data);
            Finish();
        }
        private void updateFieldsFromSavedPreferences()
        {
            string savedOrderBy = commonFilter.OrderBy;
            switch (savedOrderBy)
            {
                case CommonFilter.OrderByDateAsc:
                    radioButtonDateAsc.Checked = true;
                    break;
                case CommonFilter.OrderByDateDesc:
                    radioButtonDateDesc.Checked = true;
                    break;
                case CommonFilter.OrderByPriceAsc:
                    radioButtonPriceAsc.Checked = true;
                    break;
                case  CommonFilter.OrderByPriceDesc:
                    radioButtonPriceDesc.Checked = true;
                    break;
                default:
                    radioButtonDateAsc.Checked = true;
                    break;
            }
        }
    }
}