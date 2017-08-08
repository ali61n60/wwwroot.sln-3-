`RangeSlider` is a slider control with two handles, allowing users to
specify two values in a range.  `RangeSlider` supports iOS and Android,
and is styled to look like a native slider control on each platform.

### Adding a RangeSliderView to your iOS app

```csharp
using RangeSlider;
...

public override void ViewDidLoad ()
{
  base.ViewDidLoad ();  

  var slider = new RangeSliderView {
    Frame = new RectangleF (50, View.Center.Y - 140, View.Frame.Width - 100, 40))
  };

  slider.LeftValueChanged += value => Console.WriteLine ("Left value: {0}", value);
  slider.RightValueChanged += value => Console.WriteLine ("Right value: {0}", value);

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
  slider.LeftValueChanged += value => {
    Console.WriteLine ("Left value: {0}", value);
  };

  AddContentView (slider, new ViewGroup.LayoutParams (
    ViewGroup.LayoutParams.FillParent, ViewGroup.LayoutParams.FillParent));
}
```

To get slider values use `LeftValue` and `RightValue`:

```csharp
var lowBound = slider.LeftValue;
var highBound = slider.RightValue;
```
