<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Enumeration.aspx.cs" Inherits="WebUIMain.MicrosoftAjaxLibrary.Enumeration" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Enumeration</title>
    <script src="../StyleScript/jquery-1.11.3.js"></script>
    <script src="MicrosoftAjax.js"></script>
    <script src="Enumeration.js"></script>
</head>
<body>
  <form id="Main" runat="server">
        <asp:ScriptManager runat="server" ID="scriptManager" />
    </form>

    <div>
        <p>This example creates an Enumeration of colors
            and applies them to page background.</p>

        <select id="ColorPicker" onchange="ChangeColor(options[selectedIndex].value)">
            
            <option value="Blue"  >Blue</option>
            <option value="Red"  >Red</option>
            <option value="Green"  >Green</option>
            <option value="White"  >White</option>
        </select>

    </div>

   
    <script type="text/javascript">
        
    function ChangeColor(value) 
    {
        var bgColor = eval("Demo.Color." + value + ";");
        $("body").css("background-color",bgColor);
    }

    $(document).ready(function () {
        var selectedColor = $("#ColorPicker").val();
        ChangeColor(selectedColor);
    })

    </script>

</body>
</html>
