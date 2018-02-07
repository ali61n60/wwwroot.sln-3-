using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;
using ModelStd.Advertisements;

namespace ChiKoja.SingleAds
{
    public class SingleAdArrayAdapter:ArrayAdapter<AdvertisementCommon>
    {
        private Context _context;
        private IList<AdvertisementCommon> _advertisementCommonList;

        public SingleAdArrayAdapter(Context context, int textViewResourceId, IList<AdvertisementCommon> objects) : base(context, textViewResourceId, objects)
        {
            _context = context;
            _advertisementCommonList = objects;
        }

        public void AddItemsToList(IList<AdvertisementCommon> newItems)
        {
            foreach (AdvertisementCommon adCommon in newItems)
            {
                _advertisementCommonList.Add(adCommon);
            }
        }

        public AdvertisementCommon GetItem(int position)
        {
            return _advertisementCommonList[position];
        }

        public override int Count { get { return _advertisementCommonList.Count; } }

        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            AdvertisementCommon adCommon = _advertisementCommonList[position];
            LayoutInflater inflater = (LayoutInflater) _context.GetSystemService(Context.LayoutInflaterService);
            View view = inflater.Inflate(Resource.Layout.SingleAdView, null);
            //TODO set views prop
            TextView textViewAdTitle;
            TextView textViewAdPrice;
            TextView textViewNumberOfVisit;
            ImageView imageViewFirstImage;
            
            textViewAdTitle = view.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = adCommon.AdvertisementTitle;

            textViewAdPrice = view.FindViewById<TextView>(Resource.Id.textViewAdPrice);
            textViewAdPrice.Text = adCommon.AdvertisementPrice.PriceString;

            textViewNumberOfVisit = view.FindViewById<TextView>(Resource.Id.textViewNumberOfVisit);
            textViewNumberOfVisit.Text =_context.Resources.GetString(Resource.String.Visit) + " " + adCommon.NumberOfVisit;

            imageViewFirstImage = view.FindViewById<ImageView>(Resource.Id.imageViewFirstImage);
            if (adCommon.AdvertisementImages[0] != null)
            {
                byte[] decodedString = Base64.Decode(adCommon.AdvertisementImages[0], Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageViewFirstImage.SetImageBitmap(decodedByte);
            }
            
            return view;
        }
    }
}