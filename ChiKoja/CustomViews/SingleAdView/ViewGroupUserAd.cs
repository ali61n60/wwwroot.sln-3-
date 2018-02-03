using System;
using Android.Content;
using Android.Graphics;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace ChiKoja.CustomViews.SingleAdView
{
    class ViewGroupUserAd : LinearLayout
    {
        TextView textViewAdTitle;
        TextView textViewAdPrice;
        ImageView imageViewFirstImage;
        Button buttonViewDetail;
        Button buttonEdit;
        Button buttonDelete;
        public ViewGroupUserAd(Context context) : base(context)
        {
            initializeViews();
        }
        private void initializeViews()
        {
            var layoutInflater = (LayoutInflater)Context.GetSystemService(Context.LayoutInflaterService);
            View mainView = layoutInflater.Inflate(Resource.Layout.SingleUserAd, this, true);
            textViewAdTitle = mainView.FindViewById<TextView>(Resource.Id.textViewAdTitle);
            textViewAdPrice = mainView.FindViewById<TextView>(Resource.Id.textViewAdPrice);
            
            imageViewFirstImage = mainView.FindViewById<ImageView>(Resource.Id.imageViewFirstImage);
            buttonViewDetail = mainView.FindViewById<Button>(Resource.Id.buttonViewDetail);
            buttonViewDetail.Click += (IntentSender, e) => { AdDetail.AdDetail.ShowAdDetail(AdGuid, AdCategoryId, Context); };
            buttonEdit = mainView.FindViewById<Button>(Resource.Id.buttonEdit);
            buttonDelete = mainView.FindViewById<Button>(Resource.Id.buttonDelete);
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