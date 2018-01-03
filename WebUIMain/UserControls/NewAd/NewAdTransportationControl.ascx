<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NewAdTransportationControl.ascx.cs" Inherits="WebUIMain.UserControls.NewAd.NewAdAttributeTransportation" %>


  
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
            
        </div>
        

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


