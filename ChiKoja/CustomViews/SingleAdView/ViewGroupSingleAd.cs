using System;
using Android.Content;
using Android.Util;
using Android.Views;
using Android.Widget;
using Android.Graphics;

namespace ChiKoja.CustomViews.SingleAdView
{
    class ViewGroupSingleAd : LinearLayout
    {
        TextView textViewAdTitle;
        TextView textViewAdPrice;
        TextView textViewNumberOfVisit;
        ImageView imageViewFirstImage;

        int adNumberOfVisit;
       
        public ViewGroupSingleAd(Context context): base(context)
        {
            initializeViews();
            hookUpViews();
        }
        private void initializeViews()
        {
            var layoutInflater = (LayoutInflater)Context.GetSystemService(Context.LayoutInflaterService);
            View mainView = layoutInflater.Inflate(Resource.Layout.SingleAdView, this, true);
            textViewAdTitle = mainView.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdPrice = mainView.FindViewById<TextView>(Resource.Id.textViewAdPrice);
            textViewNumberOfVisit = mainView.FindViewById<TextView>(Resource.Id.textViewNumberOfVisit);
            imageViewFirstImage = mainView.FindViewById<ImageView>(Resource.Id.imageViewFirstImage);
        }
        private void hookUpViews()
        {
            Click += (IntentSender, e) => { AdDetail.AdDetail.ShowAdDetail(AdGuid, AdCategoryId, Context); };
        }
        public int AdCategoryId { get; set; }
        public Guid AdGuid { get; set; }
        public string AdTitle
        {
            get { return textViewAdTitle.Text; }
            set { textViewAdTitle.Text = value; }
        }
        public string AdPrice
        {
            get { return textViewAdPrice.Text; }
            set { textViewAdPrice.Text = value; }
        }
        public string AdImage
        {
            set { setBitmapImage(imageViewFirstImage, value); }
        }

        public int AdNumberOfVisit {
            get
            {return adNumberOfVisit;}
            set
            {
                adNumberOfVisit = value;
                textViewNumberOfVisit.Text = Resources.GetString(Resource.String.Visit) + " " + value;
            } 
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