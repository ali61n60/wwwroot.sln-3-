using Android.Content;
using Android.Widget;
using Android.Util;

namespace ChiKoja.CustomViews.CategoryView
{
    public class CheckBoxTriStates : CheckBox
    {
        //TODO to be completed
        //TODO set size of the drawable base on view size
        private const int UNKNOW = -1;
        private const int UNCHECKED = 0;
        private const int CHECKED = 1;
        private int _state;
        public CheckBoxTriStates(Context context)
            : base(context)
        {
            init();
        }
        public CheckBoxTriStates(Context context, IAttributeSet attrs)
            : base(context, attrs)
        {
            init();
        }
        public CheckBoxTriStates(Context context, IAttributeSet attrs, int defStyleAttr)
            : base(context, attrs, defStyleAttr)
        {
            init();
        }
        private void init()
        {
            _state = UNKNOW;
            updateBtn();
            CheckedChange += (sender, args) =>
            {
                switch (_state)
                {
                    case UNKNOW:
                        _state = UNCHECKED;
                        break;
                    case UNCHECKED:
                        _state = CHECKED;
                        break;
                    case CHECKED:
                        _state = UNKNOW;
                        break;
                }
                updateBtn();
            };



            //        SetOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener() {

            //    // checkbox status is changed from uncheck to checked.
            //    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked)
            //    {
            //        switch (state)
            //        {
            //            case UNKNOW:
            //                state = UNCHECKED;
            //                break;
            //            case UNCHECKED:
            //                state = CHECKED;
            //                break;
            //            case CHECKED:
            //                state = UNKNOW;
            //                break;
            //        }
            //        updateBtn();
            //    }
            //});

        }

        private void updateBtn()
        {
            int btnDrawable = Resource.Drawable.arrow_left2;//ic_checkbox_indeterminate_black;
            switch (_state)
            {
                case UNKNOW:
                    btnDrawable = Resource.Drawable.arrow_left2;
                    break;
                case UNCHECKED:
                    btnDrawable = Resource.Drawable.arrow_down1;//ic_checkbox_unchecked_black;
                    break;
                case CHECKED:
                    btnDrawable = Resource.Drawable.arrow_down2;//ic_checkbox_checked_black;
                    break;
            }
            SetButtonDrawable(btnDrawable);
        }
        public int getState()
        {
            return _state;
        }

        public void setState(int state)
        {
            _state = state;
            updateBtn();
        }

    }

}