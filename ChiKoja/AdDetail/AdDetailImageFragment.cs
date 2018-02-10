﻿using System.Collections.Generic;
using System.Linq;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Support.V4.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using ChiKoja.Utility;

namespace ChiKoja.AdDetail
{
    class AdDetailImageFragment : Fragment
    {
        private View rootView;
        private LinearLayout linearLayoutImageContainer;
        private List<string> _images;
        
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_image, container, false);
            return rootView;
        }

        public override async void OnResume()
        {
            base.OnResume();

            initializeFields();
            initializeEvents();
        }

        public void SetImages(IEnumerable<string> images)
        {
            _images=images.ToList();
            ScreenUtility screenUtility = new ScreenUtility(Activity);
            int imageWidth = (int)(150 * screenUtility.GetDensity());
            int imageHeight = (int)(150 * screenUtility.GetDensity());
            //TODO add images to view
            for (int i = 1; i < _images.Count; i +=2)// just show big images
            {
                var imageView = new ImageView(Activity);
                setBitmapImage(imageView, _images[i]);
                
                LinearLayout.LayoutParams layoutParams =new LinearLayout.LayoutParams(imageWidth, imageHeight);
                layoutParams.SetMargins(10, 10, 10, 10);

                linearLayoutImageContainer.AddView(imageView, layoutParams);
            }
        }

        private void initializeFields()
        {
            linearLayoutImageContainer = rootView.FindViewById<LinearLayout>(Resource.Id.linearLayoutImageContainer);
        }

        private void initializeEvents()
        {

        }

        private void setBitmapImage(ImageView imageView, string base64String)
        {
            if (base64String != null)
            {
                byte[] decodedString = Base64.Decode(base64String, Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageView.SetImageBitmap(decodedByte);
            }
        }
    }
}