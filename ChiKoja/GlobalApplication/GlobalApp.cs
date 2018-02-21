using System;
using System.Threading.Tasks;
using Android.App;
using Android.Runtime;
using Android.Widget;
using ChiKoja.Notification;
using ServiceLayer;

namespace ChiKoja.GlobalApplication
{
    [Application(Icon = "@drawable/icon", Label = "@string/ApplicationName")]
    public class GlobalApp : Application, ICallBack
    {
        private static GlobalApp _singleton;
        private static MessageShower _messageShower;
        public  const int ManageDatabaseRequestCode = 1;
        
        public static GlobalApp GetGlobalApp()
        {
            return _singleton;
        }

        //Constructor is private. Access an instanse through GetGlobalApp method
        private GlobalApp(IntPtr handle, JniHandleOwnership transfer): base(handle, transfer)
        {
            _messageShower = MessageShower.GetMessageShower(this);
        }

        public override void OnCreate()
        {
            base.OnCreate();
            _singleton = this;

            AppDomain.CurrentDomain.UnhandledException += currentDomainOnUnhandledException;
            TaskScheduler.UnobservedTaskException += taskSchedulerOnUnobservedTaskException;
            AndroidEnvironment.UnhandledExceptionRaiser += androidEnvironment_UnhandledExceptionRaiser;
        }
        
        private void androidEnvironment_UnhandledExceptionRaiser(object sender, RaiseThrowableEventArgs e)
        {
            Toast.MakeText(GetGlobalApp(), e.Exception.Message + " in Andoid environment", ToastLength.Long).Show();
            e.Handled = true;
        }

        private void taskSchedulerOnUnobservedTaskException
            (object sender, UnobservedTaskExceptionEventArgs unobservedTaskExceptionEventArgs)
        {
            Toast.MakeText(GetGlobalApp(), unobservedTaskExceptionEventArgs.Exception.Message + " in Task", ToastLength.Long).Show();
            unobservedTaskExceptionEventArgs.SetObserved();
        }

        private void currentDomainOnUnhandledException(object sender, UnhandledExceptionEventArgs unhandledExceptionEventArgs)
        {
            Exception ex = (Exception)unhandledExceptionEventArgs.ExceptionObject;
            Toast.MakeText(GetGlobalApp(), ex.Message + " in Current Domain", ToastLength.Long).Show();
        }

        public void OnSuccess(int requestCode)
        {
            if (requestCode == ManageDatabaseRequestCode)
            {
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

        public static MessageShower GetMessageShower()
        {
            return _messageShower ?? (_messageShower = MessageShower.GetMessageShower(Context));
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