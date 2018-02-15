using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Widget;

namespace ChiKoja.Dialog.AlertDialog
{
    [Activity(Label = "AlertDialogActivity", Icon = "@drawable/icon")]
    public class AlertDialogActivity : AppCompatActivity
    {
        AppCompatButton buttonShowAlertDialog;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.alert_dialog);
            buttonShowAlertDialog = FindViewById<AppCompatButton>(Resource.Id.buttonShowAlertDialog);
            buttonShowAlertDialog.Click += buttonShowAlertDialog_Click;
        }

        void buttonShowAlertDialog_Click(object sender, EventArgs e)
        {
           Android.App.AlertDialog.Builder dialogBuilder= new Android.App.AlertDialog.Builder(this);
            dialogBuilder.SetTitle("Reset>")
                .SetMessage("Are You Sure?")
                .SetCancelable(false)
                .SetPositiveButton("Yes",(o,args)=>{Toast.MakeText(this,"Selected Yes",ToastLength.Long).Show();})
                .SetNegativeButton("No",NegativeButtonHandler );
            Android.App.AlertDialog alertDialog = dialogBuilder.Create();
            alertDialog.Show();
        }

        private void NegativeButtonHandler(object sender, DialogClickEventArgs eventArgs)
        {
            Toast.MakeText(this,"Selected No",ToastLength.Long).Show();
        }
    }
}