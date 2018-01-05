export class ImageUploader {
    private _imageUploadInputId: string = "imageUpload";
    private _messageToUserDivId: string = "labelMessageToUser";
    private _loadedImagesDivId: string = "loadedImageView";
    private _sendingImageTemplateId: string = "sendingImageTemplate";
    private _addedImageTemplateId: string = "addedImage";

    private _sendFilesToServerUrl: string = "/api/AdApi/AddTempImage";

    constructor() {
        this.initView();
    }

    private sendFilesToServer(fileList: FileList): void {
        var data = new FormData();
        for (var i = 0; i < fileList.length; i++) {
            data.append(fileList[i].name, fileList[i]);
        }//for
        $.ajax({
            type: "POST",
            url: this._sendFilesToServerUrl,
            contentType: false,
            processData: false,
            data: data,
            success: (msg, textStatus, jqXHR) => this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails

        });//ajax
        this.showSendingImage();
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        this.showMessageToUser("");
        $("#imageUpload").val("");
        //TODO check for data.success parameter
        if (msg.success == true) {
            this.addNewImageToPage(msg.responseData);
        }//if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
        }//else
    }//onSuccessGetItemsFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("خطا در ارسال");
    } //end OnErrorGetTimeFromServer

    private initView(): void {
        $(document).ready(() => {
            $("#" + this._imageUploadInputId).change((event) => {
                let fileUpload: HTMLInputElement = $("#" + this._imageUploadInputId).get(0) as HTMLInputElement;
                let files: FileList = fileUpload.files;
                this.sendFilesToServer(files);

            });//change

            $(document).on('click', '.addedImage > input', function (event) {
                //todo call server to remove temp file and also remove it from page
                alert($(this).parent().attr("id"));
            });//click

        });//ready
    }


    private showSendingImage() {
        var $sendingImageTemplate = $("#sendingImageTemplate").clone();
        this.showMessageToUser($sendingImageTemplate.html());
    }//showSendingImage


    private addNewImageToPage(data) {
        //TODO create a copy of newImage template and add it to page
        var responseImage = "data:image/jpg;base64," + data.image;
        var template = $('#addedImage').html();
        var templateData = {
            imageId: data.imageFileName,
            imageSrc: responseImage
        } //data
        var html = Mustache.to_html(template, templateData);
        $("#loadedImageView").append(html);
    }//addNewImageToPage

    private showMessageToUser(msg) {
        $("#labelMessageToUser").html(msg);
    }//serverResult



    private removeImageFromSession(event) {
        var form_data = new FormData();                  // Creating object of FormData class
        form_data.append("method", "deleteImage");               // Adding extra parameters to form_data
        form_data.append("imageId", event.data.imageId);
        this.reportMessageToUser("در حال حذف فایل");
        $.ajax({//C# Method call
            type: 'POST',
            processData: false, // important
            contentType: false, // important
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
        });//end $.ajax C# call
    }//end removeImageFromSession

    private reportMessageToUser(message) {
       let $newMessage = $("<span style=\"color:red\">" + message + "</span><br />");
        $newMessage.hide();
        $("#labelUploadResult").children().remove();
        $("#labelUploadResult").append($newMessage);
        $newMessage.show().delay(2000).hide(1000);
    }//end reportMessageToUser
}