//TODO what if a send file request is sent but response.success is false, or OnError
//it seems good practice to add a timer to the uploadingImageTemplate and remove template after timer ticks.
//but if a response comes with success=true manually add the uploaded image to the loadedImageView
//
export class ImageUploader {
    private readonly ImageUploadInputId: string = "imageUpload";
    private readonly MessageToUserDivId: string = "labelMessageToUser";
    private readonly LoadedImagesDivId: string = "loadedImageView";
    private readonly UploadingImageTemplate: string = "uploadingImageTemplate";

    private _sendFilesToServerUrl: string = "/api/AdApi/AddTempImage";
    private _removeFileFromServerUrl: string = "/api/AdApi/RemoveTempImage";

    private _currentNewAdGuid: string;
    private _requestIndex: number = 0;

    constructor(currentNewAdGuid: string) {
        this._currentNewAdGuid = currentNewAdGuid;
        this.initView();
    }

    private initView(): void {
        $(document).ready(() => {
            $("#" + this.ImageUploadInputId).change((event) => {
                let fileUpload: HTMLInputElement = $("#" + this.ImageUploadInputId).get(0) as HTMLInputElement;
                let files: FileList = fileUpload.files;
                this.sendFilesToServer(files);

            }); //change

            $(document).on("click", ".addedImage > input", (event) => {
                this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
            }); //click

        }); //ready
    }

    private sendFilesToServer(fileList: FileList): void {
        this._requestIndex++;
        var data = new FormData();
        data.append("NewAdGuid", this._currentNewAdGuid);//magic string
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
            success: (msg, textStatus, jqXHR) => this.onSuccessSendFileToServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorSendFileToServer(jqXHR, textStatus, errorThrown) // When Service call fails

        }); //ajax
        this.addUploadingImageTemplate();
    }

   private onSuccessSendFileToServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
       $("#" + this.ImageUploadInputId).val("");
       
        if (msg.success == true) {
            this.updateSendingImageTemplate(msg.responseData);
        } //if
        else {
            this.showMessageToUser(msg.messag + " ," + msg.errorCode);
          
        } //else
    } //onSuccessGetItemsFromServer

    private onErrorSendFileToServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("خطا در ارسال");//magic string
    } //end OnErrorGetTimeFromServer

    private addUploadingImageTemplate(): void {
        let template = $("#" + this.UploadingImageTemplate).html();//magic string
        let data = { RequestIndex: this._requestIndex };//magic string

        let html = Mustache.to_html(template, data);
        $("#" + this.LoadedImagesDivId).append(html);
    }

   
    private updateSendingImageTemplate(data) {
        $("#loadedImageView > #uploadingImage" + data.requestIndex + " >img").
            attr("src", "data:image/jpg;base64," + data.image)
    }

    private showMessageToUser(msg) {
        $("#" + this.MessageToUserDivId).html(msg);
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
            success: (msg, textStatus, jqXHR) => this.onSuccessRemoveFileFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorRemoveFileFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax
        this.showMessageToUser("removing file from server");
    }


    private onSuccessRemoveFileFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        if (msg.success == true) {
            this.showMessageToUser("done removing file from server");
            let fileName: string = msg.responseData;
            $(`[id="${fileName}"]`).remove();


        } else {
            this.showMessageToUser(msg.message);
        }
    }

    private onErrorRemoveFileFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("error, " + errorThrown);
    }
}

class UploadedImage {
    public Image: string;
    public ImageFileName: string;
}