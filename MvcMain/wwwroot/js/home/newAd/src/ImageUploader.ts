export class ImageUploader {
    private _imageUploadInputId: string = "imageUpload";
    private _messageToUserDivId: string = "labelMessageToUser";
    private _loadedImagesDivId: string = "loadedImageView";
    private _sendingImageTemplateId: string = "sendingImageTemplate";
    private _addedImageTemplateId: string = "addedImage";

    private _sendFilesToServerUrl: string = "/api/AdApi/AddTempImage";
    private _removeFileFromServerUrl: string = "/api/AdApi/RemoveTempImage";

    constructor() {
        this.initView();
    }

    private initView(): void {
        $(document).ready(() => {
            $("#" + this._imageUploadInputId).change((event) => {
                let fileUpload: HTMLInputElement = $("#" + this._imageUploadInputId).get(0) as HTMLInputElement;
                let files: FileList = fileUpload.files;
                this.sendFilesToServer(files);

            }); //change

            $(document).on("click",
                ".addedImage > input",
                (event) => {
                    //todo call server to remove temp file and also remove it from page
                    //create a method to use ajax and call
                    // server to remove the image from the server 
                    //also remove the image from current page
                    this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
                    //alert($(event.currentTarget).parent().attr("id"));
                }); //click

        }); //ready
    }

    private sendFilesToServer(fileList: FileList): void {
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
            success: (msg, textStatus, jqXHR) =>
                this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) =>
                this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails

        }); //ajax
        this.showSendingImage();
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        this.showMessageToUser("");
        $("#" + this._imageUploadInputId).val("");
        if (msg.success == true) {
            this.addNewImageToPage(msg.responseData);
        } //if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
        } //else
    } //onSuccessGetItemsFromServer

    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("خطا در ارسال");
    } //end OnErrorGetTimeFromServer

    private showSendingImage() {
        var $sendingImageTemplate = $("#" + this._sendingImageTemplateId).clone();
        this.showMessageToUser($sendingImageTemplate.html());
    }

    private addNewImageToPage(data) {
        let template: string = $("#" + this._addedImageTemplateId).html();
        let uploadedImage: UploadedImage = new UploadedImage();
        uploadedImage.ImageFileName = data.imageFileName;
        uploadedImage.Image = "data:image/jpg;base64," + data.image;
        var html = Mustache.to_html(template, uploadedImage);
        $("#" + this._loadedImagesDivId).append(html);
    }

    private showMessageToUser(msg) {
        $("#" + this._messageToUserDivId).html(msg);
    }


    //TODO refactor this method 
    private removeImageFromServer(fileName: string) {
        let callParams = {
            FileNameToBeRemoved: fileName
        };

        $.ajax({
            type: "GET", //GET or POST or PUT or DELETE verb
            url: this._removeFileFromServerUrl,
            data: callParams, //Data sent to server
            success: (msg, textStatus, jqXHR) =>
                this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) =>
                this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    }


    private onSuccessRemoveFileFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        this.showMessageToUser("done removing file from server");
        //TODO also remove the image from the page
    }

    private onErrorRemoveFileFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("error removing file from server, " + errorThrown);
    }

}


class UploadedImage {
    public Image: string;
    public ImageFileName: string;
}