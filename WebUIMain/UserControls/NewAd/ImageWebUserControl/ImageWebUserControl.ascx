<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ImageWebUserControl.ascx.cs" Inherits="WebUIMain.UserControls.NewAd.ImageWebUserControl.ImageWebUserControl" %>
<script>
    $(document).ready(function () {
        $("#<%=FileUpload1.ClientID%>").change(uploadImage);//set event handler for change event on file upload element        
        recreateLoadedImages();// if page reloads, show added images
    })//end ready
   

    function uploadImage(elem) {
        var file_data = $("#<%=FileUpload1.ClientID%>").prop("files")[0];   // Getting the properties of file from file field
        addDivImageHolder(file_data);
        $("#<%=FileUpload1.ClientID%>").val('');
    }//end uploadImage

    function addDivImageHolder(file_data) {
        var $newdiv1 = addTempraryDiv();
        var form_data = new FormData();                 // Creating object of FormData class
        form_data.append("file", file_data);            // Appending parameter named file with properties of file_field to form_data
        form_data.append("method", "addImage");         // Adding extra parameters to form_data
        $.ajax({//C# Method call
            type: 'POST',
            processData: false, // important
            contentType: false, // important
            data: form_data,
            async: true,
            url: "<%=Page.ResolveClientUrl(imageWebUserControlHandlerAddress) %>",
            success: function (msg) {
                var jsonMessage = JSON.parse(msg);
                if (jsonMessage.status === "true") {
                    addNewImageDivToPage(jsonMessage.imageId, jsonMessage.imageUrl);
                }//end if
                else {
                    reportMessageToUser(jsonMessage.message);
                }//end else
                $newdiv1.remove();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $newdiv1.remove();
                reportMessageToUser(textStatus + "  ," + errorThrown);
            }
        });//end $.ajax C# call
    }

    function recreateLoadedImages() {
        var form_data = new FormData();                 // Creating object of FormData class
        form_data.append("method", "recreateLoadedImages");         // Adding extra parameters to form_data
        $.ajax({//C# Method call
            type: 'POST',
            processData: false, // important
            contentType: false, // important
            data: form_data,
            async: true,
            url: "<%= Page.ResolveClientUrl(imageWebUserControlHandlerAddress) %>",
            success: function (msg) {
                var jsonMessage = JSON.parse(msg);
                if (jsonMessage.status === "true") {
                    var numberOfImages = jsonMessage.numberOfImages;
                    for (var i = 0; i < numberOfImages; i++) {
                        addNewImageDivToPage(jsonMessage.imagesUrl[i].imageId, jsonMessage.imagesUrl[i].imageUrl);
                    }//end for                                     
                }//end if
                else {
                    reportMessageToUser(jsonMessage.message);
                }//end else
            }, //end success
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                reportMessageToUser(textStatus + "  ," + errorThrown);
            }//end error
        });//end $.ajax C# call
    }//end  recreateLoadedImages

    function removeImageFromSession(event) {
        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append("method", "deleteImage");               // Adding extra parameters to form_data
        form_data.append("imageId", event.data.imageId);
        reportMessageToUser("در حال حذف فایل");
        $.ajax({//C# Method call
            type: 'POST',
            processData: false, // important
            contentType: false, // important
            data: form_data,
            async: true,
            url: "<%= Page.ResolveClientUrl(imageWebUserControlHandlerAddress) %>",
            success: function (msg) {
                var jsonMessage = JSON.parse(msg);
                reportMessageToUser(jsonMessage.message);
                $(event.target).parent().remove();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                reportMessageToUser(textStatus + "  ," + errorThrown);
            }
        });//end $.ajax C# call        
    }//end removeImageFromSession

    function addNewImageDivToPage(divId, imageSrc) {
        var $newdiv1 = $("<div id= '" + divId + "' class='col-sm-2'></div>");
        var $image = $("<img class='img-rounded img-responsive'  src=\"" + imageSrc + "\"/>");
        var $button = $("<input type='button' class='btn btn-primary btn-block' value='حذف' />");
        $button.on("click", { imageId: divId }, removeImageFromSession);
        $newdiv1.append($image);
        $newdiv1.append($button);
        var ImagePlaceHolder = $("#<%=loadedImageView.ClientID%>");
        ImagePlaceHolder.append($newdiv1);
    }//end addNewImageDivToPage

    function addTempraryDiv() {
        var ImagePlaceHolder = $("#<%=loadedImageView.ClientID%>");
        var $newdiv1 = $("<div class='col-sm-2' style='border: 2px solid blue; margin:5px'></div>");
        var $newSpan = $("<p  dir='rtl' >" + "در حال ارسال فایل" + "</p>");
        var $image = $("<img src=\"/General/loader.gif\" width=\"50px\" height=\"50px\"   />");
        $newdiv1.append($newSpan);
        $newdiv1.append($image);
        ImagePlaceHolder.append($newdiv1);
        return $newdiv1;
    }//end addTempraryDiv

    function reportMessageToUser(message) {
        $newMessage = $("<span style=\"color:red\">" + message + "</span><br />");
        $newMessage.hide();
        $("#<%=LabelUploadResult.ClientID%>").children().remove();
        $("#<%=LabelUploadResult.ClientID%>").append($newMessage);
        $newMessage.show().delay(2000).hide(1000);
    }//end reportMessageToUser



</script>

<div class="row well">
    <div class="col-sm-4 col-sm-push-8 text-right">
        <asp:Label ID="Label7" runat="server" Text="ارسال عکس"></asp:Label>
        <br />
        <asp:FileUpload ID="FileUpload1" runat="server" class="btn btn-info btn-block" />
        <br />
        <div id="LabelUploadResult" runat="server">
        </div>

        <br />
    </div>
    <div class="col-sm-8 col-sm-pull-4 col-sm-push-0">
        <div id="loadedImageView" runat="server" class="row">
        </div>
    </div>
</div>
