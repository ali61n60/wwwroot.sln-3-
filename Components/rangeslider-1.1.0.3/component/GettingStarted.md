`RangeSlider` is a slider control with two handles, allowing users to
specify two values in a range.  `RangeSlider` supports iOS and Android,
and is styled to look like a native slider control on each platform.

## Examples

### Adding a RangeSliderView to your iOS app

```csharp
using RangeSlider;
using System.Drawing;
...

public override void ViewDidLoad ()
{
  base.ViewDidLoad ();

  var slider = new RangeSliderView {
    Frame = new RectangleF (50, View.Center.Y - 140, View.Frame.Width - 100, 40)
  };

  View.AddSubview (slider);
}
```

### Adding a RangeSliderView to your Android app

```csharp
using RangeSlider;
...

protected override void OnCreate (Bundle bundle)
{
  base.OnCreate (bundle);

  var slider = new RangeSliderView (this);
  AddContentView (slider, new ViewGroup.LayoutParams (
    ViewGroup.LayoutParams.FillParent, ViewGroup.LayoutParams.FillParent));
}
```
 
### Getting slider values

```csharp
var lowBound = slider.LeftValue;
var highBound = slider.RightValue;
```

### Setting slider values

```csharp
slider.LeftValue = initLowBound;
slider.RightValue = initHighBound;
```

### Receiving change events

```csharp
slider.LeftValueChanged += value => {
  Console.WriteLine ("Left value: {0}", value);
};

slider.RightValueChanged += value => {
  Console.WriteLine ("Right value: {0}", value);
};
```

### Adding a RangeSlider to an AXML Layout:

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:orientation="vertical" android:layout_width="fill_parent" android:layout_height="fill_parent">
  <rangeslider.RangeSliderView
    android:id="@+id/rangeSlider"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    min_value="0"
    max_value="100"
    left_value="20"
    right_value="80"/>
</LinearLayout>
```
