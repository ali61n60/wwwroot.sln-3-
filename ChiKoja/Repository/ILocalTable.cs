using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace ChiKoja.Repository
{
    public interface ILocalTable
    {
        void CompareLocalTableVersionWithServerVersionAndUpdateIfNedded(object locker);
        void CreateTable(object locker);
        //T[] GetAll<T>(object locker);
        void PopulateTableDataFromServer(object locker);
        void RemoveTableData(object locker);
        int OperationOrder { get;}
    }
}