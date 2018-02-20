using System.Collections.Generic;
using Android.Content;
using Android.Graphics;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Android.Widget;
using CustomViews.MarkAd;
using ModelStd.Advertisements;

namespace ChiKoja.ArrayAdapters.SingleAd
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

        public override void Clear()
        {
            _advertisementCommonList.Clear();
        }

        public override int Count { get { return _advertisementCommonList.Count; } }

        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            AdvertisementCommon adCommon = _advertisementCommonList[position];
            LayoutInflater inflater = (LayoutInflater) _context.GetSystemService(Context.LayoutInflaterService);
            View rootView = inflater.Inflate(Resource.Layout.single_ad_view, null);
            //TODO set views prop
            AppCompatTextView textViewAdTitle;
            AppCompatTextView textViewAdPrice;
            AppCompatTextView textViewNumberOfVisit;
            AppCompatTextView textViewLocation;
            AppCompatImageView imageViewFirstImage;
            MarkAdView markAdView;
            
            textViewAdTitle = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewAdTitle);
            textViewAdTitle.Text = adCommon.AdTitle;

            textViewAdPrice = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewAdPrice);
            textViewAdPrice.Text = adCommon.AdPrice.PriceString;

            textViewNumberOfVisit = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewNumberOfVisit);
            textViewNumberOfVisit.Text =_context.Resources.GetString(Resource.String.Visit) + " " + adCommon.NumberOfVisits;

            textViewLocation = rootView.FindViewById<AppCompatTextView>(Resource.Id.textViewLocation);
            textViewLocation.Text = adCommon.CityName + "," + adCommon.DistrictName;

            imageViewFirstImage = rootView.FindViewById<AppCompatImageView>(Resource.Id.imageViewFirstImage);
            if (adCommon.AdImages[0] != null)
            {
                byte[] decodedString = Base64.Decode(adCommon.AdImages[0], Base64Flags.Default);
                Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length);
                imageViewFirstImage.SetImageBitmap(decodedByte);
            }

            markAdView = rootView.FindViewById<MarkAdView>(Resource.Id.markAdView);
            markAdView.Click += (sender, args) =>
            {
                markAdView.SetMark(!markAdView.GetMark());
            };
            
            return rootView;
        }
    }
}