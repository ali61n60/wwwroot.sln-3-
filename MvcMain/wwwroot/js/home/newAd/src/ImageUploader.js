"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO what if a send file request is sent but response.success is false, or OnError
//it seems good practice to add a timer to the uploadingImageTemplate and remove template after timer ticks.
//but if a response comes with success=true manually add the uploaded image to the loadedImageView
//
var ImageUploader = /** @class */ (function () {
    function ImageUploader(currentNewAdGuid) {
        this.ImageUploadInputId = "imageUpload";
        this.MessageToUserDivId = "labelMessageToUser";
        this.LoadedImagesDivId = "loadedImageView";
        this.UploadingImageTemplate = "uploadingImageTemplate";
        this._sendFilesToServerUrl = "/api/AdApi/AddTempImage";
        this._removeFileFromServerUrl = "/api/AdApi/RemoveTempImage";
        this._requestIndex = 0;
        this._currentNewAdGuid = currentNewAdGuid;
        this.initView();
    }
    ImageUploader.prototype.initView = function () {
        var _this = this;
        $(document).ready(function () {
            $("#" + _this.ImageUploadInputId).change(function (event) {
                var fileUpload = $("#" + _this.ImageUploadInputId).get(0);
                var files = fileUpload.files;
                _this.sendFilesToServer(files);
            }); //change
            $(document).on("click", ".addedImage > input", function (event) {
                _this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
            }); //click
        }); //ready
    };
    ImageUploader.prototype.sendFilesToServer = function (fileList) {
        var _this = this;
        this._requestIndex++;
        var data = new FormData();
        data.append("NewAdGuid", this._currentNewAdGuid); //magic string
        data.append("RequestIndex", this._requestIndex.toString());
        for (var i = 0; i < fileList.length; i++) {
            data.append(fileList[i].name, fileList[i]);
        } //for
        $.ajax({
            type: "POST",
            url: this._sendFilesToServerUrl,
            contentType: false,
            processData: false,
            data: data,
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessSendFileToServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorSendFileToServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //ajax
        this.addUploadingImageTemplate();
    };
    ImageUploader.prototype.onSuccessSendFileToServer = function (msg, textStatus, jqXHR) {
        $("#" + this.ImageUploadInputId).val("");
        if (msg.success == true) {
            this.updateSendingImageTemplate(msg.responseData);
        } //if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
        } //else
    }; //onSuccessGetItemsFromServer
    ImageUploader.prototype.onErrorSendFileToServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("خطا در ارسال"); //magic string
    }; //end OnErrorGetTimeFromServer
    ImageUploader.prototype.addUploadingImageTemplate = function () {
        var template = $("#" + this.UploadingImageTemplate).html(); //magic string
        var data = { RequestIndex: this._requestIndex }; //magic string
        var html = Mustache.to_html(template, data);
        $("#" + this.LoadedImagesDivId).append(html);
    };
    ImageUploader.prototype.updateSendingImageTemplate = function (data) {
        $("#loadedImageView > #uploadingImage" + data.requestIndex + " >img").
            attr("src", "data:image/jpg;base64," + data.image);
    };
    ImageUploader.prototype.showMessageToUser = function (msg) {
        $("#" + this.MessageToUserDivId).html(msg);
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
            success: function (msg, textStatus, jqXHR) { return _this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR); },
            error: function (jqXHR, textStatus, errorThrown) { return _this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown); } // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    };
    ImageUploader.prototype.onSuccessRemoveFileFromServer = function (msg, textStatus, jqXHR) {
        if (msg.success == true) {
            this.showMessageToUser("done removing file from server");
            var fileName = msg.responseData;
            $("[id=\"" + fileName + "\"]").remove();
        }
        else {
            this.showMessageToUser(msg.message);
        }
    };
    ImageUploader.prototype.onErrorRemoveFileFromServer = function (jqXHR, textStatus, errorThrown) {
        this.showMessageToUser("error, " + errorThrown);
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