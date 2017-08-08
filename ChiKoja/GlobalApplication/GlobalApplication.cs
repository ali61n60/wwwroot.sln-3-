using System;
using System.Threading.Tasks;
using Android.App;
using Android.Runtime;
using Android.Widget;
using ChiKoja.Notification;
using Exception = System.Exception;
using ServiceLayer;

namespace ChiKoja.GlobalApplication
{
    [Application(Icon = "@drawable/icon", Label = "@string/ApplicationName")]
    public class GlobalApplication : Application, ICallBack
    {
        //Learn LINQ
        //Learn Lambda
        //Learn Action<T>
        //Learn more StructureMap IOC and manage localTables
        //Learn and use UNIT TEST, Integration test, Interaction test, UI test, Acceptance test, Approval test, Telerik test studio
        //Learn MOCK Framework
        //Learn and use UML
        //Learn Source code control programs
        //Learn ProtoBuffer
        //Learn multiple server balanceing load
        //Learn System.Runtime.Caching MemoryCache.Default.Add(...)
        //Learn Lazy<T> for using lazy loading
        //Learn Logging Log4net, NLOG, ...
        //Learn Func<Order, double> Expression<Func<Employee,bool>>
        //Learn Neti & webrtc


        //Create Advertisement in app service ***
        
        //TODO use Gateway pattern for web service classes
        //TODO Add setting section and update localdatabase option in it
        //TODO when updating database reprot the user how much the process has progressed
        //TODO Add ShowMarkedAd Activity
        //TODO In AdDetail check if the ad is marked user could understand it from a visual clue
        //TODO Add Report ad
        //TODO Add Sort By Number Of Visit
        //TODO Add category selection fragment for search AND for new ad
        //TODO Add new advertisement
        //TODO Add User Ads
        //TODO add capability for users to send messages to each other
        //TODO add expandableListView to Filter activity
        //TODO convert unnecessary activities into fragments
        
        //TODO Add notify me for specific items
        //TODO Add users credit
        //TODO ActivitySearchAd add "No More Result" when search returns 0 item
        //TODO ActivitySearchAd add Automatic Search when scrolled result
        //TODO ActivitySearchAd add Max number of result setter by user
        //TODO double-check local tableVersion storage and how to manage exception when updation
        //TODO design category selection view for new ad
        
        //TODO every call to data layer should check for exception and try to give user retry option

        //BUG messageShower call to server may be lost if after call current activity Die. Try to use a service instead of activity to call
        //server and manage MessageShower at service layer
        
        //BUG in category Selection activity when a parent is selected and button select all,with button deselect all is clicked the parent is still selected
         


        private static GlobalApplication _singleton;
        private static MessageShower _messageShower;
        private const int ManageDatabaseRequestCode = 1;
        
        public static int NumberOfRunningWorkerThread = 0;
        public bool DatabaseChecked { get; private set; }



        public static GlobalApplication GetGlobalApplication()
        {
            return _singleton;
        }

        GlobalApplication(IntPtr handle, JniHandleOwnership transfer)
            : base(handle, transfer)
        {
            DatabaseChecked = false;
            _messageShower = MessageShower.GetMessageShower(this);
         //   RegisterReceiver(new NetWorkStatusReceiver(),
             //   new IntentFilter(Android.Net.ConnectivityManager.ConnectivityAction));
        }

        public override void OnCreate()
        {
            base.OnCreate();
            _singleton = this;

            AppDomain.CurrentDomain.UnhandledException += CurrentDomainOnUnhandledException;
            TaskScheduler.UnobservedTaskException += TaskSchedulerOnUnobservedTaskException;
            AndroidEnvironment.UnhandledExceptionRaiser += AndroidEnvironment_UnhandledExceptionRaiser;
        }
        public void ManageDatabaseFile()
        {
            if (DatabaseChecked)
            {
                MessageShower.GetMessageShower(this).ShowMessage("Database Already Checked", ShowMessageType.Long);//TODO move string to resource
                return;
            }
            Repository.Repository repository = new Repository.Repository();
            GetMessageShower().ShowMessage(Resources.GetString(Resource.String.CheckingDatabase), ShowMessageType.Permanent);
            repository.ManageDatabaseFileAndData(Resources, this, ManageDatabaseRequestCode);
        }

        public static MessageShower GetMessageShower()
        {
            return _messageShower ?? (_messageShower = MessageShower.GetMessageShower(Context));
        }

        void AndroidEnvironment_UnhandledExceptionRaiser(object sender, RaiseThrowableEventArgs e)
        {
            Toast.MakeText(GetGlobalApplication(), e.Exception.Message + " in Andoid environment", ToastLength.Long).Show();
            e.Handled = true;
        }

        private static void TaskSchedulerOnUnobservedTaskException
            (object sender, UnobservedTaskExceptionEventArgs unobservedTaskExceptionEventArgs)
        {
            Toast.MakeText(GetGlobalApplication(), unobservedTaskExceptionEventArgs.Exception.Message + " in Task", ToastLength.Long).Show();
            unobservedTaskExceptionEventArgs.SetObserved();
        }

        private static void CurrentDomainOnUnhandledException(object sender, UnhandledExceptionEventArgs unhandledExceptionEventArgs)
        {
            Exception ex = (Exception)unhandledExceptionEventArgs.ExceptionObject;
            Toast.MakeText(GetGlobalApplication(), ex.Message + " in Current Domain", ToastLength.Long).Show();
        }

        public void OnSuccess(int requestCode)
        {
            if (requestCode == ManageDatabaseRequestCode)
            {
                DatabaseChecked = true;
                GetMessageShower().ShowMessage(Resources.GetString(Resource.String.DatabeseUpdated), ShowMessageType.Long);
            }
        }

        public void OnError(int requestCode,Exception ex)
        {
            if (requestCode == ManageDatabaseRequestCode)
            {
                //TODO give retry option to user
                GetMessageShower().ShowMessage("Error" + ex.Message, ShowMessageType.Permanent);
            }
        }

        public void OnProgress(int requestCode, int progressPercent)
        {
            if (requestCode == ManageDatabaseRequestCode)
            {
                GetMessageShower().ShowMessage(Resources.GetString(Resource.String.CheckingDatabase)+" "+progressPercent+"%", ShowMessageType.Permanent);
            }
        }
    }









    /*

    USE [ayoobfar_db]
GO

/****** Object:  StoredProcedure [dbo].[sp_increment_number_of_visit]    Script Date: 1/14/2017 7:01:16 PM ******/
/*
 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[sp_increment_number_of_visit]
(
@adGuid UniqueIdentifier
)
AS
BEGIN
DECLARE @oldNumberOfVisit int
     BEGIN TRANSACTION
	 --get previous numberOfVisit
	  SELECT @oldNumberOfVisit=adNumberOfVisited FROM Advertisements WHERE Advertisements.adId=@adGuid
	 -- update Advertisements table
	  UPDATE Advertisements SET 
             adNumberOfVisited=@oldNumberOfVisit+1
             WHERE adId=@adGuid;

	 IF @@ERROR!=0
		 BEGIN
		     ROLLBACK TRANSACTION;
			 RETURN 0;
	     END
    COMMIT TRANSACTION

	RETURN 1;
END



GO


    */

}