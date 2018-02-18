using Android.Content;
using Android.OS;
using Android.Views;
using Android.Support.V4.App;
using Android.Support.V7.Widget;
using Android.Widget;

namespace ChiKoja.Activities.AdDetail
{
    class AdDetailContactOwnerFragment:Fragment
    {
        View rootView;
        private AppCompatButton  buttonCall;
        private AppCompatButton buttonSendSms;
        //TODO get it from argument
        private string _phoneNumber = "123456";
        
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            rootView = inflater.Inflate(Resource.Layout.ad_detail_contact_owner_frag, container, false);
            return rootView;
        }
        
        public void SetPhoneNumber(string phoneNumber)
        {
            _phoneNumber = phoneNumber;
            initializeFields();
            initializeEvents();
        }
        
        private void initializeFields()
        {
            buttonCall = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonCall);
            buttonSendSms = rootView.FindViewById<AppCompatButton>(Resource.Id.buttonSendSms);
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