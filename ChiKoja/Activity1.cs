using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace ChiKoja
{
    [Activity(Label = "ChiKoja", Icon = "@drawable/icon")]
    public class Activity1 : Activity
    {
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            SetContentView(Resource.Layout.layout1);
            initialItems();
            

        }

        private void initialItems()
        {
            initSpinner();
            initButton1();
        }

        private void initButton1()
        {
            Button button1 = FindViewById<Button>(Resource.Id.button1);
            button1.Click += button1_Click;
            
        }

        int dynamicButtonCount = 0;

        void button1_Click(object sender, EventArgs e)
        {
            Button button=new Button(this);
            button.Text = "DynamicButton" + dynamicButtonCount++;

            LinearLayout ll = FindViewById<LinearLayout>(Resource.Id.linearLayout2);
            ViewGroup.LayoutParams lp=new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WrapContent,ViewGroup.LayoutParams.WrapContent);


            ll.AddView(button,lp);
        }

        private void initSpinner()
        {
            Spinner spinner = FindViewById<Spinner>(Resource.Id.spinner1);
            ArrayAdapter adapter = ArrayAdapter.CreateFromResource(this, Resource.Array.planets_array,
                Android.Resource.Layout.SimpleSpinnerItem);
            adapter.SetDropDownViewResource(Android.Resource.Layout.SimpleSpinnerDropDownItem);
            spinner.Adapter = adapter;
            spinner.ItemSelected += spinner_ItemSelected;
        }

        void spinner_ItemSelected(object sender, AdapterView.ItemSelectedEventArgs e)
        {
            Spinner spinner = (Spinner)sender;

            string toast = string.Format("The planet is {0}", spinner.GetItemAtPosition(e.Position));
            Toast.MakeText(this, toast, ToastLength.Long).Show();
        }
    }
}