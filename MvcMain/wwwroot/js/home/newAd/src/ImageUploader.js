"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageUploader = /** @class */ (function () {
    function ImageUploader() {
        this._imageUploadInputId = "imageUpload";
        this._messageToUserDivId = "labelMessageToUser";
        this._loadedImagesDivId = "loadedImageView";
        this._sendingImageTemplateId = "sendingImageTemplate";
        this._addedImageTemplateId = "addedImage";
        this._sendFilesToServerUrl = "/api/AdApi/AddTempImage";
        this.initView();
    }
    ImageUploader.prototype.sendFilesToServer = function (fileList) {
        var _this = this;
        var data = new FormData();
        for (var i = 0; i < fileList.length; i++) {
            data.append(fileList[i].name, fileList[i]);
        } //for
        $.ajax({
            type: "POST",
            url: this._sendFilesToServerUrl,
            contentType: false,
            processData: false,
            data: data,
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //ajax
        this.showSendingImage();
    };
    ImageUploader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this.showMessageToUser("");
        $("#imageUpload").val("");
        //TODO check for data.success parameter
        if (msg.success == true) {
            this.addNewImageToPage(msg.responseData);
        } //if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
        } //else
    }; //onSuccessGetItemsFromServer
    ImageUploader.prototype.onErrorGetItemsFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("خطا در ارسال");
    }; //end OnErrorGetTimeFromServer
    ImageUploader.prototype.initView = function () {
        var _this = this;
        $(document).ready(function () {
            $("#" + _this._imageUploadInputId).change(function (event) {
                var fileUpload = $("#" + _this._imageUploadInputId).get(0);
                var files = fileUpload.files;
                _this.sendFilesToServer(files);
            }); //change
            $(document).on('click', '.addedImage > input', function (event) {
                //todo call server to remove temp file and also remove it from page
                alert($(this).parent().attr("id"));
            }); //click
        }); //ready
    };
    ImageUploader.prototype.showSendingImage = function () {
        var $sendingImageTemplate = $("#sendingImageTemplate").clone();
        this.showMessageToUser($sendingImageTemplate.html());
    }; //showSendingImage
    ImageUploader.prototype.addNewImageToPage = function (data) {
        //TODO create a copy of newImage template and add it to page
        var responseImage = "data:image/jpg;base64," + data.image;
        var template = $('#addedImage').html();
        var templateData = {
            imageId: data.imageFileName,
            imageSrc: responseImage
        }; //data
        var html = Mustache.to_html(template, templateData);
        $("#loadedImageView").append(html);
    }; //addNewImageToPage
    ImageUploader.prototype.showMessageToUser = function (msg) {
        $("#labelMessageToUser").html(msg);
    }; //serverResult
    ImageUploader.prototype.removeImageFromSession = function (event) {
        var form_data = new FormData(); // Creating object of FormData class
        form_data.append("method", "deleteImage"); // Adding extra parameters to form_data
        form_data.append("imageId", event.data.imageId);
        this.reportMessageToUser("در حال حذف فایل");
        $.ajax({
            type: 'POST',
            processData: false,
            contentType: false,
            data: form_data,
            async: true,
            url: "<%= Page.ResolveClientUrl(imageWebUserControlHandlerAddress) %>",
            success: function (msg) {
                var jsonMessage = JSON.parse(msg);
                this.reportMessageToUser(jsonMessage.message);
                $(event.target).parent().remove();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                this.reportMessageToUser(textStatus + "  ," + errorThrown);
            }
        }); //end $.ajax C# call
    }; //end removeImageFromSession
    ImageUploader.prototype.reportMessageToUser = function (message) {
        var $newMessage = $("<span style=\"color:red\">" + message + "</span><br />");
        $newMessage.hide();
        $("#labelUploadResult").children().remove();
        $("#labelUploadResult").append($newMessage);
        $newMessage.show().delay(2000).hide(1000);
    }; //end reportMessageToUser
    return ImageUploader;
}());
exports.ImageUploader = ImageUploader;
//# sourceMappingURL=ImageUploader.js.map