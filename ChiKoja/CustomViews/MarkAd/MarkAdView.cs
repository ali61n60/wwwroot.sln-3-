using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Locations;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace CustomViews.MarkAd
{
    class MarkAdView : View
    {
        private bool _isMerked;
        private Paint _paint;
        public MarkAdView(Context context) : base(context)
        {
            init();
        }

       

        public MarkAdView(Context context, IAttributeSet attrs) : base(context, attrs)
        {
            init();
        }

        private void init()
        {
            _paint=new Paint(PaintFlags.AntiAlias);
            _paint.Color = Color.Gold;
            _paint.StrokeWidth = 3;
            
        }

        public void SetMark(bool isMerked)
        {
            if (_isMerked != isMerked)
            {
                _isMerked = isMerked;
                Invalidate();
            }
        }

        public bool GetMark()
        {
            return _isMerked;
        }

        protected override void OnMeasure(int widthMeasureSpec, int heightMeasureSpec)
        {
            base.OnMeasure(widthMeasureSpec, heightMeasureSpec);

            int lenght = Math.Min(MeasuredWidth, MeasuredHeight);

            SetMeasuredDimension(lenght, lenght);
        }
        
        
        protected override void OnDraw(Canvas canvas)
        {
            int cx = Width / 2;
            int cy = Height / 2;
            if (_isMerked)
            {
                canvas.DrawCircle(cx,cy,Width/3,_paint);
            }
            
           
            canvas.Save();
            for (int i = 0; i < 6; i++)
            {
                canvas.DrawLine(cx, 0, Width, cy, _paint);
                canvas.Rotate(60, cx, cy);
            }

            canvas.Restore();
        }
        
    }
}