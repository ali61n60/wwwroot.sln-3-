﻿<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NewAdTransportationControl.ascx.cs" Inherits="WebUIMain.UserControls.NewAd.NewAdAttributeTransportation" %>

<asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:petropas_dbConnectionString %>" SelectCommand="SELECT [brandId], [brandName] FROM [Brands]"></asp:SqlDataSource>
<asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:petropas_dbConnectionString %>" SelectCommand="SELECT [modelName], [modelId] FROM [CarModel] WHERE ([brandId] = @brandId)">
    <SelectParameters>
        <asp:ControlParameter ControlID="DropDownListBrand" Name="brandId" PropertyName="SelectedValue" Type="Int32" />
    </SelectParameters>
</asp:SqlDataSource>

<div class="well">
    <div class="row">
        <div class="col-sm-12">
            <input id="ButtonTransport" type="button" value="button" />
        </div>
    </div>
    <div class="row">
        <div class="col-sm-2 col-sm-push-10">
            <asp:Label ID="Label1" runat="server" Text="برند"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-push-4">
            <asp:DropDownList ID="DropDownListBrand" runat="server" DataSourceID="SqlDataSource1" DataTextField="brandName" DataValueField="brandId"
                OnSelectedIndexChanged="DropDownListBrand_SelectedIndexChanged" AutoPostBack="True" Width="100%" CssClass="text-right" Font-Size="Larger">
            </asp:DropDownList>
        </div>
        <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
            <asp:Label ID="Label2" runat="server" Text="مدل"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-pull-8 col-sm-push-0">
            <asp:DropDownList ID="DropDownListModel" runat="server" DataSourceID="SqlDataSource2" DataTextField="modelName" DataValueField="modelId"
                Width="100%" Font-Size="Larger" CssClass="text-right">
            </asp:DropDownList>
        </div>
    </div>
    <br />
    <div class="row">
        <div class="col-sm-2 col-sm-push-10">
            <asp:Label ID="Label4" runat="server" Text="سال تولید"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-push-4">
            <asp:DropDownList ID="DropDownListMakeYear" runat="server" Width="100%" CssClass="text-right">
                <asp:ListItem Value="1350">1350</asp:ListItem>
                <asp:ListItem Value="1351">1351</asp:ListItem>
                <asp:ListItem Value="1352">1352</asp:ListItem>
                <asp:ListItem Value="1353">1353</asp:ListItem>
                <asp:ListItem Value="1354">1354</asp:ListItem>
                <asp:ListItem Value="1355">1355</asp:ListItem>
                <asp:ListItem Value="1356">1356</asp:ListItem>
                <asp:ListItem Value="1357">1357</asp:ListItem>
                <asp:ListItem Value="1358">1358</asp:ListItem>
                <asp:ListItem Value="1359">1359</asp:ListItem>
                <asp:ListItem Value="1360">1360</asp:ListItem>
                <asp:ListItem Value="1361">1361</asp:ListItem>
                <asp:ListItem Value="1362">1362</asp:ListItem>
                <asp:ListItem Value="1363">1363</asp:ListItem>
                <asp:ListItem Value="1364">1364</asp:ListItem>
                <asp:ListItem Value="1365">1365</asp:ListItem>
                <asp:ListItem Value="1366">1366</asp:ListItem>
                <asp:ListItem Value="1367">1367</asp:ListItem>
                <asp:ListItem Value="1368">1368</asp:ListItem>
                <asp:ListItem Value="1369">1369</asp:ListItem>
                <asp:ListItem Value="1370">1370</asp:ListItem>
                <asp:ListItem Value="1371">1371</asp:ListItem>
                <asp:ListItem Value="1372">1372</asp:ListItem>
                <asp:ListItem Value="1373">1373</asp:ListItem>
                <asp:ListItem Value="1374">1374</asp:ListItem>
                <asp:ListItem Value="1375">1376</asp:ListItem>
                <asp:ListItem Value="1376">1376</asp:ListItem>
                <asp:ListItem Value="1377">1377</asp:ListItem>
                <asp:ListItem Value="1378">1378</asp:ListItem>
                <asp:ListItem Value="1379">1379</asp:ListItem>
                <asp:ListItem Value="1380">1380</asp:ListItem>
                <asp:ListItem Value="1381">1381</asp:ListItem>
                <asp:ListItem Value="1382">1382</asp:ListItem>
                <asp:ListItem Value="1383">1383</asp:ListItem>
                <asp:ListItem Value="1384">1384</asp:ListItem>
                <asp:ListItem Value="1385">1385</asp:ListItem>
                <asp:ListItem Value="1386">1386</asp:ListItem>
                <asp:ListItem Value="1387">1387</asp:ListItem>
                <asp:ListItem Value="1388">1388</asp:ListItem>
                <asp:ListItem Value="1389">1389</asp:ListItem>
                <asp:ListItem Value="1390">1390</asp:ListItem>
                <asp:ListItem Value="1391">1391</asp:ListItem>
                <asp:ListItem Value="1392">1392</asp:ListItem>
                <asp:ListItem Value="1394">1393</asp:ListItem>
                <asp:ListItem Value="1394">1394</asp:ListItem>
            </asp:DropDownList>
        </div>
        <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
            <asp:Label ID="Label3" runat="server" Text="سوخت"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-pull-8 col-sm-push-0">
            <asp:DropDownList ID="DropDownListFuel" runat="server" Font-Size="Larger" Width="100%" CssClass="text-right">
                <asp:ListItem Value="0">بنزین</asp:ListItem>
                <asp:ListItem Value="1">دوگانه سوز</asp:ListItem>
                <asp:ListItem Value="2">دیزل</asp:ListItem>
                <asp:ListItem Value="3">گاز</asp:ListItem>
                <asp:ListItem Value="4">الکتریکی</asp:ListItem>
                <asp:ListItem Value="5">هیبرید</asp:ListItem>
            </asp:DropDownList>
        </div>
    </div>
    <br />
    <div class="row">
        <div class="col-sm-2 col-sm-push-10">
            <asp:RadioButton ID="RadioButtonUsed" runat="server" Text="کارکرده" GroupName="NewUsed" Checked="True" AutoPostBack="True" OnCheckedChanged="RadioButtonUsed_CheckedChanged" />
            <br />
            <asp:RadioButton ID="RadioButtonDraft" runat="server" Text="حواله" GroupName="NewUsed" AutoPostBack="True" OnCheckedChanged="RadioButtonUsed_CheckedChanged" />
            <br />
            <asp:RadioButton ID="RadioButtonNew" runat="server" Text="صفر" GroupName="NewUsed" AutoPostBack="True" OnCheckedChanged="RadioButtonUsed_CheckedChanged" />
            <br />
        </div>
        <div class="col-sm-4 col-sm-push-4">
            <asp:TextBox ID="TextBoxMileage" runat="server" placeholder="کارکرد بر حسب کیلومتر" Width="100%">10000</asp:TextBox>
            <asp:RequiredFieldValidator ID="RequiredFieldValidatorMileage" runat="server" ErrorMessage="لطفا کارکرد را وارد نمایید" ControlToValidate="TextBoxMileage" ValidationGroup="Group1" Display="Dynamic" SetFocusOnError="True" ForeColor="Red">لطفا کارکرد را وارد نمایید</asp:RequiredFieldValidator>
            <asp:RangeValidator ID="RangeValidatorMileage" runat="server" ControlToValidate="TextBoxMileage" ErrorMessage="کارکرد وارد شده صحیح نیست" MinimumValue="0" SetFocusOnError="True" Type="Integer" MaximumValue="100000000" ValidationGroup="Group1" Display="Dynamic" ForeColor="Red">کارکرد وارد شده صحیح نیست</asp:RangeValidator>
        </div>
        <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
            <asp:Label ID="Label5" runat="server" Text="گیربکس"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-pull-8 col-sm-push-0 text-right">
            <asp:RadioButton ID="RadioButtonManual" runat="server" Text="دنده ای" Checked="True" GroupName="Gearbox" />
            <br />
            <asp:RadioButton ID="RadioButtonAutomatic" runat="server" Text="اتوماتیک" GroupName="Gearbox" />
        </div>
    </div>
    <br />
    <div class="well">
        <div class="row">

            <div class="col-sm-2 col-sm-push-10">
                <asp:RadioButton ID="RadioButtonCash" runat="server" Text="نقد" GroupName="Payment"
                    OnCheckedChanged="RadioButtonInsatllment_CheckedChanged" Checked="True" AutoPostBack="True" />
                <br />
                <br />
                <asp:RadioButton ID="RadioButtonInsatllment" runat="server" Text="قسطی" GroupName="Payment"
                    OnCheckedChanged="RadioButtonInsatllment_CheckedChanged" AutoPostBack="True" />
            </div>
            <div class="col-sm-4 col-sm-push-4">
                <asp:TextBox ID="TextBoxPriceCash" runat="server" placeholder="قیمت نقدی" Width="100%"></asp:TextBox>
                <br />
                <br />
                <asp:TextBox ID="TextBoxTotalInstallments" runat="server" placeholder="تعداد اقساط" Enabled="False" Width="100%"></asp:TextBox>
                <br />
                <br />
                <asp:TextBox ID="TextBoxDistanceBetweenPerPayment" runat="server" placeholder="فاصله بین اقساط بر حسب ماه" Enabled="False" Width="100%"></asp:TextBox>
                <br />
                <br />
                <asp:TextBox ID="TextBoxPayPerInstallment" runat="server" placeholder="مبلغ هر قسط" Enabled="False" Width="100%"></asp:TextBox>
            </div>
            <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
                <asp:Label ID="Label6" runat="server" Text="نوع پلاک"></asp:Label>
            </div>
            <div class="col-sm-4 col-sm-pull-8 col-sm-push-0 text-right">
                <asp:RadioButton ID="RadioButtonNationalPlate" runat="server" Text="پلاک ملی" Checked="True" GroupName="Plate" />
                <br />
                <asp:RadioButton ID="RadioButtonFreeRegionPlate" runat="server" Text="منطقه آزاد" GroupName="Plate" />
                <br />
                <asp:RadioButton ID="RadioButtonTemporaryPlate" runat="server" Text="گذر موقت" GroupName="Plate" />
            </div>
        </div>
        <br />

    </div>
    <br />

    <div class="row">
        <div class="col-sm-2 col-sm-push-10">
            <asp:Label ID="Label8" runat="server" Text="رنگ خارجی"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-push-4">
            <asp:DropDownList ID="DropDownListBodyColor" runat="server" Width="100%" CssClass="text-right">
                <asp:ListItem Value="1">آبی</asp:ListItem>
                <asp:ListItem Value="8">آلبالویی</asp:ListItem>
                <asp:ListItem Value="9">اخرائی</asp:ListItem>
                <asp:ListItem Value="10">اطلسی</asp:ListItem>
                <asp:ListItem Value="11">بادمجانی</asp:ListItem>
                <asp:ListItem Value="36">برنز</asp:ListItem>
                <asp:ListItem Value="12">بژ</asp:ListItem>
                <asp:ListItem Value="13">بنفش</asp:ListItem>
                <asp:ListItem Value="14">پوست پیازی</asp:ListItem>
                <asp:ListItem Value="15">خاکستری</asp:ListItem>
                <asp:ListItem Value="16">خاکی</asp:ListItem>
                <asp:ListItem Value="37">دلفینی</asp:ListItem>
                <asp:ListItem Value="17">زرد</asp:ListItem>
                <asp:ListItem Value="18">زرشکی</asp:ListItem>
                <asp:ListItem Value="34">زیتونی</asp:ListItem>
                <asp:ListItem Value="3">سبز</asp:ListItem>
                <asp:ListItem Value="19">سربی</asp:ListItem>
                <asp:ListItem Value="20">سرمه ای</asp:ListItem>
                <asp:ListItem Value="5" Selected="True">سفید</asp:ListItem>
                <asp:ListItem Value="40">سفید صدفی</asp:ListItem>
                <asp:ListItem Value="35">شتری</asp:ListItem>
                <asp:ListItem Value="21">صورتی</asp:ListItem>
                <asp:ListItem Value="22">طلائی</asp:ListItem>
                <asp:ListItem Value="33">طوسی</asp:ListItem>
                <asp:ListItem Value="23">عدسی</asp:ListItem>
                <asp:ListItem Value="24">عنابی</asp:ListItem>
                <asp:ListItem Value="2">قرمز</asp:ListItem>
                <asp:ListItem Value="25">قهوه ای</asp:ListItem>
                <asp:ListItem Value="38">گیلاسی</asp:ListItem>
                <asp:ListItem Value="32">مارون</asp:ListItem>
                <asp:ListItem Value="27">مسی</asp:ListItem>
                <asp:ListItem Value="6">مشکی</asp:ListItem>
                <asp:ListItem Value="41">موکا</asp:ListItem>
                <asp:ListItem Value="4">نارنجی</asp:ListItem>
                <asp:ListItem Value="0">نامشخص</asp:ListItem>
                <asp:ListItem Value="28">نقرآبی</asp:ListItem>
                <asp:ListItem Value="29">نقره ای</asp:ListItem>
                <asp:ListItem Value="30">نوک مدادی</asp:ListItem>
                <asp:ListItem Value="42">کربن بلک</asp:ListItem>
                <asp:ListItem Value="26">کرم</asp:ListItem>
                <asp:ListItem Value="39">یاسی</asp:ListItem>
                <asp:ListItem Value="31">یشمی</asp:ListItem>
            </asp:DropDownList>
        </div>
        <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
            <asp:Label ID="Label9" runat="server" Text="رنگ داخلی"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-pull-8 col-sm-push-0">
            <asp:DropDownList ID="DropDownListInternalColor" runat="server" Width="100%" CssClass="text-right">
                <asp:ListItem Value="1">آبی</asp:ListItem>
                <asp:ListItem Value="8">آلبالویی</asp:ListItem>
                <asp:ListItem Value="9">اخرائی</asp:ListItem>
                <asp:ListItem Value="10">اطلسی</asp:ListItem>
                <asp:ListItem Value="11">بادمجانی</asp:ListItem>
                <asp:ListItem Value="36">برنز</asp:ListItem>
                <asp:ListItem Value="12">بژ</asp:ListItem>
                <asp:ListItem Value="13">بنفش</asp:ListItem>
                <asp:ListItem Value="14">پوست پیازی</asp:ListItem>
                <asp:ListItem Value="15">خاکستری</asp:ListItem>
                <asp:ListItem Value="16">خاکی</asp:ListItem>
                <asp:ListItem Value="37">دلفینی</asp:ListItem>
                <asp:ListItem Value="17">زرد</asp:ListItem>
                <asp:ListItem Value="18">زرشکی</asp:ListItem>
                <asp:ListItem Value="34">زیتونی</asp:ListItem>
                <asp:ListItem Value="3">سبز</asp:ListItem>
                <asp:ListItem Value="19">سربی</asp:ListItem>
                <asp:ListItem Value="20">سرمه ای</asp:ListItem>
                <asp:ListItem Value="5">سفید</asp:ListItem>
                <asp:ListItem Value="40">سفید صدفی</asp:ListItem>
                <asp:ListItem Value="35">شتری</asp:ListItem>
                <asp:ListItem Value="21">صورتی</asp:ListItem>
                <asp:ListItem Value="22">طلائی</asp:ListItem>
                <asp:ListItem Value="33">طوسی</asp:ListItem>
                <asp:ListItem Value="23">عدسی</asp:ListItem>
                <asp:ListItem Value="24">عنابی</asp:ListItem>
                <asp:ListItem Value="2">قرمز</asp:ListItem>
                <asp:ListItem Value="25">قهوه ای</asp:ListItem>
                <asp:ListItem Value="38">گیلاسی</asp:ListItem>
                <asp:ListItem Value="32">مارون</asp:ListItem>
                <asp:ListItem Value="27">مسی</asp:ListItem>
                <asp:ListItem Value="6" Selected="True">مشکی</asp:ListItem>
                <asp:ListItem Value="41">موکا</asp:ListItem>
                <asp:ListItem Value="4">نارنجی</asp:ListItem>
                <asp:ListItem Value="0">نامشخص</asp:ListItem>
                <asp:ListItem Value="28">نقرآبی</asp:ListItem>
                <asp:ListItem Value="29">نقره ای</asp:ListItem>
                <asp:ListItem Value="30">نوک مدادی</asp:ListItem>
                <asp:ListItem Value="42">کربن بلک</asp:ListItem>
                <asp:ListItem Value="26">کرم</asp:ListItem>
                <asp:ListItem Value="39">یاسی</asp:ListItem>
                <asp:ListItem Value="31">یشمی</asp:ListItem>
            </asp:DropDownList>
        </div>
    </div>
    <br />

    <div class="row">
        <div class="col-sm-2 col-sm-push-10">
            <asp:Label ID="Label10" runat="server" Text="وضعیت بدنه "></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-push-4">
            <asp:DropDownList ID="DropDownListBodyStatus" runat="server" Width="100%" CssClass="text-right">

                <asp:ListItem Value="0" Selected="True">بدون رنگ</asp:ListItem>
                <asp:ListItem Value="1">یک لکه رنگ</asp:ListItem>
                <asp:ListItem Value="2">دو لکه رنگ</asp:ListItem>
                <asp:ListItem Value="3">چند لکه رنگ</asp:ListItem>
                <asp:ListItem Value="4">گلگیر رنگ</asp:ListItem>
                <asp:ListItem Value="5">گلگیر تعویض</asp:ListItem>
                <asp:ListItem Value="6">کاپوت رنگ</asp:ListItem>
                <asp:ListItem Value="7">دور رنگ</asp:ListItem>
                <asp:ListItem Value="8">کامل رنگ</asp:ListItem>
                <asp:ListItem Value="9">تصادفی</asp:ListItem>
                <asp:ListItem Value="10">اوراقی</asp:ListItem>
                <asp:ListItem Value="11">اتاق تعویض</asp:ListItem>
            </asp:DropDownList>
        </div>
        <div class="col-sm-2 col-sm-pull-2 col-sm-push-0">
            <asp:Label ID="Label7" runat="server" Text="نوع خودرو"></asp:Label>
        </div>
        <div class="col-sm-4 col-sm-pull-8 col-sm-push-0">
            <asp:DropDownList ID="DropDownListCarType" runat="server" Width="100%" CssClass="text-right">
                <asp:ListItem Value="0">سواری</asp:ListItem>
                <asp:ListItem Value="1">وانت</asp:ListItem>
                <asp:ListItem Value="2">شاسی بلند</asp:ListItem>
                <asp:ListItem Value="3">ون</asp:ListItem>
                <asp:ListItem Value="4">کروک</asp:ListItem>
                <asp:ListItem Value="5">کوپه</asp:ListItem>
            </asp:DropDownList>
        </div>
    </div>
</div>
<asp:ValidationSummary ID="ValidationSummary1" runat="server" ShowMessageBox="True" ValidationGroup="Group1" />
