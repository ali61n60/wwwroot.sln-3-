using System;
using System.Collections.Generic;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using ChiKoja.NavigationDrawer;
using ChiKoja.Repository.Location;
using ModelStd.Db.Ad;


namespace ChiKoja.LocationSelection
{
    [Activity(Label = "ActivityCitySelection", Theme = "@style/Theme.Main")]
    public class ActivityLocationSelection : NavActivity
    {
        bool locationSelectionChanged = false;

        ListView listViewAllProvinces;
        ListView listViewSelectedProvinces;
        ProvinceArrayAdapter arrayAdapterAllProvinces;
        ProvinceArrayAdapter arrayAdapterSelectedProvinces;
        Button buttonReturn;
        TextView textViewSelectedProvince; 
        TextView textViewCurrentLocationVersion;
        
        CityRepository cityRepository;
        ProvinceRepository provinceRepository;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.location_selection);
            cityRepository=new CityRepository(Repository.Repository.DataBasePath);
            provinceRepository = new ProvinceRepository(Repository.Repository.DataBasePath);

            listViewAllProvinces = FindViewById<ListView>(Resource.Id.listViewAllProvinces);
            fillArrayAdapter();
            listViewAllProvinces.Adapter = arrayAdapterAllProvinces;
            listViewAllProvinces.ItemClick += listViewAllProvinces_ItemClick;

            listViewSelectedProvinces = FindViewById<ListView>(Resource.Id.listViewSelectedProvinces);
            fillSelectedProvincesArrayAdapter();
            listViewSelectedProvinces.Adapter = arrayAdapterSelectedProvinces;
            listViewSelectedProvinces.ItemClick += listViewSelectedProvinces_ItemClick;
            
            buttonReturn = FindViewById<Button>(Resource.Id.buttonReturn);
            buttonReturn.Click += buttonReturn_Click;

            textViewSelectedProvince = FindViewById<TextView>(Resource.Id.textViewSelectedProvince);
            textViewCurrentLocationVersion = FindViewById<TextView>(Resource.Id.textViewCurrentLocationVersion);
            setCurrentLocationVersion();
        }

        void listViewSelectedProvinces_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
        {
            provinceRepository.SetProvinceAsNotSelected(arrayAdapterSelectedProvinces.GetItem(e.Position));
            arrayAdapterSelectedProvinces.Remove(arrayAdapterSelectedProvinces.GetItem(e.Position));
            arrayAdapterSelectedProvinces.NotifyDataSetChanged();
        }

        private void fillSelectedProvincesArrayAdapter()
        {
            arrayAdapterSelectedProvinces=new ProvinceArrayAdapter(this,Android.Resource.Layout.SimpleListItem1);
            Province[] selectedProvinces = new ProvinceRepository(Repository.Repository.DataBasePath).GetSelectedProvinces();
            foreach (Province province in selectedProvinces)
            {
                arrayAdapterSelectedProvinces.Add(province);
            }
        }

        private void fillArrayAdapter()
        {
            arrayAdapterAllProvinces = new ProvinceArrayAdapter(this, Android.Resource.Layout.SimpleListItem1);
            Province[] allProvinces = new ProvinceRepository(Repository.Repository.DataBasePath).GetAll(Repository.Repository.Locker);
            foreach(Province province in allProvinces)
            {
                arrayAdapterAllProvinces.Add(province);
            }

        }

        void listViewAllProvinces_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
        {
            addSelectedItemToSelectedList(arrayAdapterAllProvinces.GetItem(e.Position));
           
            textViewSelectedProvince.Text = arrayAdapterAllProvinces.GetItem(e.Position).ProvinceName;
        }

        private void addSelectedItemToSelectedList(Province province)
        {
            for (int i = 0; i < arrayAdapterSelectedProvinces.Count; i++)
            {
                if (arrayAdapterSelectedProvinces.GetItem(i).ProvinceId == province.ProvinceId)
                {
                    Toast.MakeText(this,"Already Added",ToastLength.Long).Show();
                    return;//Already added
                }
            }
            provinceRepository.SetProvinceAsSelected(province);
            arrayAdapterSelectedProvinces.Add(province);
            arrayAdapterSelectedProvinces.NotifyDataSetChanged();
        }

        private void setCurrentLocationVersion()
        {
            textViewCurrentLocationVersion.Text =cityRepository.LocalCitiesTableDataVersion.ToString();
        }
       
        void buttonReturn_Click(object sender, EventArgs e) 
        {
            Intent data=new Intent();
            data.PutExtra("locationSelectionChanged", true);
            
            cityRepository.CityPreference = textViewSelectedProvince.Text;
            SetResult(Result.Ok,data);
            Finish();
        }
    }

    public class ProvinceArrayAdapter : ArrayAdapter<Province>
    {
        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            Province province = GetItem(position);
            TextView tempTextView = new TextView(parent.Context)
            {
                TextSize = 24,
                Text = province.ProvinceName
            };
            return tempTextView;
        }

        public ProvinceArrayAdapter(IntPtr handle, JniHandleOwnership transfer) : base(handle, transfer)
        {
        }

        public ProvinceArrayAdapter(Context context, int textViewResourceId) : base(context, textViewResourceId)
        {
        }

        public ProvinceArrayAdapter(Context context, int resource, int textViewResourceId) : base(context, resource, textViewResourceId)
        {
        }

        public ProvinceArrayAdapter(Context context, int textViewResourceId,Province[] objects) : base(context, textViewResourceId, objects)
        {
        }

        public ProvinceArrayAdapter(Context context, int resource, int textViewResourceId, Province[] objects) : base(context, resource, textViewResourceId, objects)
        {
        }

        public ProvinceArrayAdapter(Context context, int textViewResourceId, IList<Province> objects) : base(context, textViewResourceId, objects)
        {
        }

        public ProvinceArrayAdapter(Context context, int resource, int textViewResourceId, IList<Province> objects) : base(context, resource, textViewResourceId, objects)
        {
        }
    }

}