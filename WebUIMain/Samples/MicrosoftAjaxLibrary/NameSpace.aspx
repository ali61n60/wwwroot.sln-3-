<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="NameSpace.aspx.cs" Inherits="WebUIMain.MicrosoftAjaxLibrary.NameSpace" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <%--<script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>--%>
    <script src="MicrosoftAjax.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <div>
            <p>
                This example creates an instance of the Person class 
            and puts it in the "Demo" namespace.
            </p>

            <input id="Button1" value="Create Demo.Person"
                type="button" onclick="return OnButton1Click()" />

        </div>
    </form>



    <script src="NameSpace.js"></script>
    <script type="text/javascript">

        function OnButton1Click() {

            var testPerson = new Demo.Person(
                'John', 'Smith', 'john.smith@example.com');

            alert(testPerson.getFirstName() + " " +
                testPerson.getLastName());

            return false;
        }
    </script>




</body>
</html>
