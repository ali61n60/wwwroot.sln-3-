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

namespace ChiKoja.TestDynamicUI
{
    [Activity(Label = "ActivityDynamicUI")]
    public class ActivityDynamicUI : Activity
    {
        Button buttonCreateUI;
        LinearLayout viewPlaceHolder;
        int count = 0;

        List<View> dynamicViews=new List<View>(); 
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.layoutDynamicUI);

            buttonCreateUI = FindViewById<Button>(Resource.Id.layoutDynamicUIbuttonCreateElement);
            buttonCreateUI.Click += buttonCreateUI_Click;

            viewPlaceHolder = FindViewById<LinearLayout>(Resource.Id.linearLayoutPlaceHolder);

            if (savedInstanceState != null)
            {
                int dynamictViewCount = savedInstanceState.GetInt("dynamicViewCount", 0);
                for (int i = 0; i < dynamictViewCount; i++)
                {
                    dynamicViews.Add(new View(this));
                }
            }
        }

        void buttonCreateUI_Click(object sender, EventArgs e)
        {
            TextView textView=new TextView(this);
            textView.Text = "newTextView" + count++;
            dynamicViews.Add(textView);

            viewPlaceHolder.AddView(textView, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent));
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
            int dynamictViewCount = -1;
            foreach (View dynamicView in dynamicViews)
            {
                dynamictViewCount++;
                outState.PutInt("mViewId_"+dynamictViewCount,dynamicView.Id);
            }
            outState.PutInt("dynamicViewCount",dynamictViewCount);
        }

        protected override void OnRestoreInstanceState(Bundle savedInstanceState)
        {
            base.OnRestoreInstanceState(savedInstanceState);
            int dynamictViewCount = savedInstanceState.GetInt("dynamicViewCount");
            for (int i = 0; i < dynamictViewCount; i++)
            {
                View view = dynamicViews[i];
                int viewId = savedInstanceState.GetInt("mViewId_" + i);
                view.Id = viewId;
            }
        }
    }
}