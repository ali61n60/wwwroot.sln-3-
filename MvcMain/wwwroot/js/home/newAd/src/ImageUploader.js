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
        this._removeFileFromServerUrl = "/api/AdApi/RemoveTempImage";
        this.initView();
    }
    ImageUploader.prototype.initView = function () {
        var _this = this;
        $(document).ready(function () {
            $("#" + _this._imageUploadInputId).change(function (event) {
                var fileUpload = $("#" + _this._imageUploadInputId).get(0);
                var files = fileUpload.files;
                _this.sendFilesToServer(files);
            }); //change
            $(document).on("click", ".addedImage > input", function (event) {
                //todo call server to remove temp file and also remove it from page
                //create a method to use ajax and call
                // server to remove the image from the server 
                //also remove the image from current page
                _this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
                //alert($(event.currentTarget).parent().attr("id"));
            }); //click
        }); //ready
    };
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
            success: function (msg, textStatus, jqXHR) {
                return _this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return _this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown);
            } // When Service call fails
        }); //ajax
        this.showSendingImage();
    };
    ImageUploader.prototype.onSuccessGetItemsFromServer = function (msg, textStatus, jqXHR) {
        this.showMessageToUser("");
        $("#" + this._imageUploadInputId).val("");
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
    ImageUploader.prototype.showSendingImage = function () {
        var $sendingImageTemplate = $("#" + this._sendingImageTemplateId).clone();
        this.showMessageToUser($sendingImageTemplate.html());
    };
    ImageUploader.prototype.addNewImageToPage = function (data) {
        var template = $("#" + this._addedImageTemplateId).html();
        var uploadedImage = new UploadedImage();
        uploadedImage.ImageFileName = data.imageFileName;
        uploadedImage.Image = "data:image/jpg;base64," + data.image;
        var html = Mustache.to_html(template, uploadedImage);
        $("#" + this._loadedImagesDivId).append(html);
    };
    ImageUploader.prototype.showMessageToUser = function (msg) {
        $("#" + this._messageToUserDivId).html(msg);
    };
    //TODO refactor this method 
    ImageUploader.prototype.removeImageFromServer = function (fileName) {
        var _this = this;
        var callParams = {
            FileNameToBeRemoved: fileName
        };
        $.ajax({
            type: "GET",
            url: this._removeFileFromServerUrl,
            data: callParams,
            success: function (msg, textStatus, jqXHR) {
                return _this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return _this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown);
            } // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    };
    ImageUploader.prototype.onSuccessRemoveFileFromServer = function (msg, textStatus, jqXHR) {
        this.showMessageToUser("done removing file from server");
    };
    ImageUploader.prototype.onErrorRemoveFileFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("error removing file from server, " + errorThrown);
    };
    return ImageUploader;
}());
exports.ImageUploader = ImageUploader;
var UploadedImage = /** @class */ (function () {
    function UploadedImage() {
    }
    return UploadedImage;
}());
//# sourceMappingURL=ImageUploader.js.map