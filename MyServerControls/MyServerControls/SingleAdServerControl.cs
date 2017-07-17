using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SingleAdItemServerControl
{
    [DefaultProperty("Text")]
    [ToolboxData("<{0}:SingleAdServerControl runat=server></{0}:SingleAdServerControl>")]
    public class SingleAdServerControl : HyperLink
    {
        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdImageUrl
        {
            get
            {
                String s = (String)ViewState["AdImageUrl"];
                return ((s == null) ? "[" + this.ID + "]" : s);
            }

            set
            {
                ViewState["AdImageUrl"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdImageHeight
        {
            get
            {
                string s = (string)ViewState["AdImageHeight"];

                s = (s == null) ? "140" : s;

                return s;
            }

            set
            {
                ViewState["AdImageHeight"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdImageWidth
        {
            get
            {
                string s = (string)ViewState["AdImageWidth"];
                s = (s == null) ? "140" : s;
                return s;
            }

            set
            {
                ViewState["AdImageWidth"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdTitle
        {
            get
            {
                String s = (String)ViewState["AdTitle"];
                return ((s == null) ? "[عنوان آگهی]" : s);
            }

            set
            {
                ViewState["AdTitle"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdTime
        {
            get
            {
                String s = (String)ViewState["AdTime"];
                return ((s == null) ? "[زمان آگهی]" : s);
            }

            set
            {
                ViewState["AdTime"] = value;
            }
        }


        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdStatus
        {
            get
            {
                String s = (String)ViewState["AdStatus"];
                return ((s == null) ? "[وضعیت آگهی]" : s);
            }

            set
            {
                ViewState["AdStatus"] = value;
            }
        }

        [Bindable(true)]
        [Category("Appearance")]
        [DefaultValue("")]
        [Localizable(true)]
        public string AdCategory
        {
            get
            {
                String s = (String)ViewState["AdCategory"];
                return ((s == null) ? "[گروه آگهی]" : s);
            }

            set
            {
                ViewState["AdCategory"] = value;
            }
        }

        Image adImage;
        Label labelAdTitle;
        Label labelAdTime;
        Label labelStatus;
        Label labelAdStatus;
        Label labelCategory;

        protected override void RenderContents(HtmlTextWriter output)
        {

            output.Write("<div class=\"row myLinks\" style=\"margin-left: 2px \">");
            output.Write("<div class=\"col-xs-6\">");
            output.Write("<div>");
            output.Write("<br />");

            adImage = new Image();
            adImage.ImageUrl = AdImageUrl;
            //adImage.ID = "Image1";
            adImage.CssClass = "img-rounded img-responsive";
            adImage.Height = Unit.Pixel(int.Parse(AdImageHeight));
            adImage.Width = Unit.Pixel(int.Parse(AdImageWidth));
            adImage.RenderControl(output);

            output.Write("<br />");
            output.Write("</div>");
            output.Write("</div>");
            output.Write("<div class=\"col-xs-6  text-right \">");
            output.Write("<div class=\"row\">");
            output.Write("<div class=\"col-xs-12 text-center\">");

            labelAdTitle = new Label();
            labelAdTitle.Text = AdTitle;
            labelAdTitle.Font.Size = FontUnit.XLarge;
            labelAdTitle.RenderControl(output);

            output.Write("</div>");
            output.Write("<div class=\"col-xs-12 \">");

            labelAdTime = new Label();
            labelAdTime.Text = AdTime;
            labelAdTime.CssClass = "pull-right";
            labelAdTime.Font.Size = FontUnit.Smaller;
            labelAdTime.RenderControl(output);
            output.Write("</div>");
            output.Write("<div class=\"col-xs-12 text-right\">");

            labelStatus = new Label();
            labelStatus.Text = "وضعیت آگهی";
            labelStatus.RenderControl(output);

            output.Write("<span class=\"glyphicon glyphicon-arrow-left\"></span>");

            labelAdStatus = new Label();
            labelAdStatus.Text = AdStatus;
            labelAdStatus.RenderControl(output);

            output.Write("</div>");
            output.Write("</div>");
            output.Write("<div class=\"row\">");
            output.Write("<div class=\"col-xs-12\">");
            output.Write("<br />");
            output.Write("<br />");

            labelCategory = new Label();
            labelCategory.Text = AdCategory;
            labelCategory.RenderControl(output);

            output.Write("</div>");
            output.Write("</div>");
            output.Write("</div>");
            output.Write("</div>");
            output.Write("<br />");
        }
    }
}

