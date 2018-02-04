using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        Task PopulateTableDataFromServer(object locker);
        void RemoveTableData(object locker);
        int OperationOrder { get;}
    }
}