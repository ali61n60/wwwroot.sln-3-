﻿using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace ChiKoja.Activities.SearchAd.SearchFilter
{
    public class SearchFilterTopTopFragment:Fragment
    {
        private Context _context;
        View rootView;
        AppCompatButton buttonOk;
        AppCompatButton buttonCancel;

        public SearchFilterTopTopFragment()
        {
        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.search_filter_toptop_frag, container, false);

            initializeFields();
            initializeEvents();

            return rootView;
        }

        private void initializeFields()
        {
            buttonOk = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonOk);
            buttonCancel = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonCancel);
        }

        private void initializeEvents()
        {
           buttonCancel.Click += (sender, args) =>
            {
                Activity.Finish();
            };

            buttonOk.Click += (sender, args) =>
            {
                //TODO persist user input 
            };
        }
        
    }
}