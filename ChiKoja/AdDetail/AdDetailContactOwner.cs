using Android.OS;
using Android.Views;
using Android.Support.V4.App;

namespace ChiKoja.AdDetail
{
    class AdDetailContactOwner:Fragment
    {
        View rootView;

        public override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            

        }

        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_contact_owner, container, false);
            return rootView;
        }
        public override async void OnResume()
        {
            base.OnResume();

            initializeFields();
            initializeEvents();
        }
        
        private void initializeFields()
        {
            
        }

        private void initializeEvents()
        {

        }

        //void buttonContactInfo_Click(object sender, EventArgs e)
        //{
        //    Android.App.Dialog contactInfoDialog = new Android.App.Dialog(Activity);
        //    contactInfoDialog.SetContentView(Resource.Layout.ContactInfoLayout);
        //    Button buttonCall = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonCall);
        //    buttonCall.Click += (s, ev) =>
        //    {
        //        Intent dialIntent = new Intent(Intent.ActionDial, Android.Net.Uri.Parse("tel:" + advertisementTransportation.PhoneNumber));
        //        StartActivity(dialIntent);
        //    };
        //    Button buttonSendSms = contactInfoDialog.FindViewById<Button>(Resource.Id.buttonSendSMS);
        //    buttonSendSms.Click += (s, ev) =>
        //    {
        //        Intent dialIntent = new Intent(Intent.ActionSendto, Android.Net.Uri.Parse("smsto:" + advertisementTransportation.PhoneNumber));
        //        StartActivity(dialIntent);
        //    };
        //    TextView textViewPhoneNumber = contactInfoDialog.FindViewById<TextView>(Resource.Id.textViewPhoneNumber);
        //    textViewPhoneNumber.Text = advertisementTransportation.PhoneNumber;

        //    contactInfoDialog.Show();
        //}


    }
}