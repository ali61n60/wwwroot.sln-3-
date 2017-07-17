using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MyServerControls
{
    [DefaultProperty("Text")]
    [ToolboxData("<{0}:ImageUtilityServerControl runat=server></{0}:ImageUtilityServerControl>")]
    public class ImageUtilityServerControl : CompositeControl
    {

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string ControlCSSClass
        {
            get
            {
                String s = (String)ViewState["ControlCSSClass"];
                return ((s == null) ? "col-sm-2" : s);
            }

            set
            {
                ViewState["ControlCSSClass"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string ImageCSSClass
        {
            get
            {
                String s = (String)ViewState["ImageCSSClass"];
                return ((s == null) ? String.Empty : s);
            }

            set
            {
                ViewState["ImageCSSClass"] = value;
            }
        }


        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string ImageURL
        {
            get
            {
                return image.ImageUrl;
            }
            set
            {
                image.ImageUrl = value;
            }
        }


        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string ButtonCSSClass
        {
            get
            {
                String s = (String)ViewState["ButtonCSSClass"];
                return ((s == null) ? String.Empty : s);
            }

            set
            {
                ViewState["ButtonCSSClass"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string ButtonText
        {
            get
            {
                String s = (String)ViewState["ButtonText"];
                return ((s == null) ? String.Empty : s);
            }

            set
            {
                ViewState["ButtonText"] = value;
            }
        }

        Image image = new Image();
        Button button = new Button();
        LiteralControl literalControl1 = new LiteralControl("<br />");

        protected override void CreateChildControls()
        {
            ImageCSSClass = "img-rounded img-responsive";
            image.CssClass = ImageCSSClass;
            image.ImageUrl = ImageURL;
            Controls.Add(image);

            Controls.Add(literalControl1);

            ButtonCSSClass = "btn btn-primary btn-block";
            button.CssClass = ButtonCSSClass;
            ButtonText = "حذف";
            button.Text = ButtonText;
            Controls.Add(button);
            button.Click += OnButtonClick;
        }

        public event EventHandler ButtonClicked;
        protected virtual void OnButtonClick(object sender, EventArgs e)
        {
            ImageURL = null;
            if (ButtonClicked != null)
            {
                ButtonClicked(this, e);
            }
        }
        protected override void Render(HtmlTextWriter writer)
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Class, ControlCSSClass);
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
            RenderChildren(writer);
            writer.RenderEndTag();
        }

    }
}