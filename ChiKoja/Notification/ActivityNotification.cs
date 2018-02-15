using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;

namespace ChiKoja.Notification
{
   
    [IntentFilter(new[] { Intent.ActionDial},
        Categories = new []{Android.Content.Intent.CategoryDefault},
        DataScheme = "tel")]
    [Activity(Label = "ActivityNotification", Icon = "@drawable/icon")]
    public class ActivityNotification : Activity
    {
        private Android.App.Notification.Builder builder;
        Android.App.Notification notification;
        NotificationManager notificationManager;
        const int notificationId = 0;
        int count = 0;

        TextView textViewPhoneNumber;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.layout_notification);

            initNotification();
            

            Button buttonUpdateNotification = FindViewById<Button>(Resource.Id.buttonUpdateNotification);
            buttonUpdateNotification.Click += buttonUpdateNotification_Click;

            textViewPhoneNumber = FindViewById<TextView>(Resource.Id.textViewPhoneNumber);
            initTextViwPhoneNumber();
            
            // Create your application here
            
        }
        
        private void initTextViwPhoneNumber()
        {
            string telUri = Intent.DataString;
            //string telUri = Intent.Extras.GetString("tel", "No Tel supplied");
            textViewPhoneNumber.Text = telUri;
        }

        private void initNotification()
        {
            // Set up an intent so that tapping the notifications returns to this app:
            Intent intent = new Intent(Intent.ActionBatteryChanged);

            const int pendingIntentId = 0;
            PendingIntent pendingIntent =
                PendingIntent.GetActivity(this, pendingIntentId, intent, PendingIntentFlags.CancelCurrent);

            builder = new Android.App.Notification.Builder(this)
                .SetContentIntent(pendingIntent)
                .SetContentTitle("Sample Notification")
                .SetContentText("Hello World! This is my first notification!")
                .SetSmallIcon(Resource.Drawable.icon)
                .SetDefaults(NotificationDefaults.Lights);

            notification = builder.Build();
            notificationManager = GetSystemService(NotificationService) as NotificationManager;
            notificationManager.Notify(notificationId, notification);
        }


        void buttonUpdateNotification_Click(object sender, EventArgs e)
        {
            // Update the existing notification builder content:
            builder.SetContentTitle("Updated Notification" + count);
            builder.SetContentText("Changed to this message." + count++);

            // Build a notification object with updated content:
            notification = builder.Build();

            // Publish the new notification with the existing ID:
            notificationManager.Notify(notificationId, notification);
        }
    }
}