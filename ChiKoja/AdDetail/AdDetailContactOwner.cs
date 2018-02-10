using Android.Content;
using Android.OS;
using Android.Views;
using Android.Support.V4.App;
using Android.Widget;

namespace ChiKoja.AdDetail
{
    class AdDetailContactOwner:Fragment
    {
        View rootView;
        private Button buttonCall;
        private Button buttonSendSms;
        //TODO get it from argument
        private string _phoneNumber = "123456";
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

        public void SetPhoneNumber(string phoneNumber)
        {
            _phoneNumber = phoneNumber;
        }
        
        private void initializeFields()
        {
            buttonCall = rootView.FindViewById<Button>(Resource.Id.buttonCall);
            buttonSendSms = rootView.FindViewById<Button>(Resource.Id.buttonSendSms);
        }

        private void initializeEvents()
        {
            buttonCall.Click += ButtonCall_Click;
            buttonSendSms.Click += ButtonSendSms_Click;
        }

        private void ButtonCall_Click(object sender, System.EventArgs e)
        {

            Intent dialIntent = new Intent(Intent.ActionDial, Android.Net.Uri.Parse("tel:" + _phoneNumber));
            StartActivity(dialIntent);
        }

        private void ButtonSendSms_Click(object sender, System.EventArgs e)
        {
            Intent dialIntent = new Intent(Intent.ActionSendto, Android.Net.Uri.Parse("smsto:" + _phoneNumber));
            StartActivity(dialIntent);
        }
    }
}