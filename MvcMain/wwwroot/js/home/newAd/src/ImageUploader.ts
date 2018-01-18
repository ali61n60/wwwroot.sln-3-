export class ImageUploader {
        
    private readonly NewAdGuidKey = "NewAdGuid";
    private readonly RequestIndexKey ="RequestIndex";
    private readonly ImageUploadInputId: string = "imageUpload";
    private readonly MessageToUserDivId: string = "labelMessageToUser";
    private readonly LoadedImagesDivId: string = "loadedImageView";
    private readonly UploadingImageTemplate: string = "uploadingImageTemplate";

    private _sendFilesToServerUrl: string = "/api/AdApi/AddTempImage";
    private _removeFileFromServerUrl: string = "/api/AdApi/RemoveTempImage";

    private _currentNewAdGuid: string;
    private _requestIndex: number = 0;
    private readonly ValidUploadTime=20000;

    constructor(currentNewAdGuid: string) {
        this._currentNewAdGuid = currentNewAdGuid;
        this.initView();
    }

    private initView(): void {
        $("#" + this.ImageUploadInputId).change((event) => {
            let fileUpload: HTMLInputElement = $("#" + this.ImageUploadInputId).get(0) as HTMLInputElement;
            let files: FileList = fileUpload.files;
            this.sendFilesToServer(files);
        });

        $(document).on("click", ".addedImage > input", (event) => {
            this.removeImageFromServer($(event.currentTarget).parent().attr("id").toString());
        });
    }

    private sendFilesToServer(fileList: FileList): void {
        this._requestIndex++;
        var data = new FormData();
        data.append(this.NewAdGuidKey, this._currentNewAdGuid);
        data.append(this.RequestIndexKey, this._requestIndex.toString());
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
        this.addUploadingImageTemplate(this._requestIndex);
    }

    private onSuccessSendFileToServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        $("#" + this.ImageUploadInputId).val("");

        if (msg.Success == true) {
            this.updateSendingImageTemplate(msg.ResponseData);
        }
        else {
            this.showMessageToUser(msg.Messag + " ," + msg.ErrorCode);
            this.uploadImageTimerExpire(parseInt(msg.ResponseData.RequestIndex));
        }
    }

    private onErrorSendFileToServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("خطا در ارسال");//magic string
    }

    private addUploadingImageTemplate(requestIndex:number): void {
        let template = $("#" + this.UploadingImageTemplate).html();//magic string
        let data = { RequestIndex: requestIndex };//magic string
        let html = Mustache.to_html(template, data);
        $("#" + this.LoadedImagesDivId).append(html);
        
        setTimeout(this.uploadImageTimerExpire,
            this.ValidUploadTime,this._requestIndex);
    }

    private uploadImageTimerExpire(uploadRequestIndex: number) {
        if ($("#loadedImageView > #uploadingImage" + uploadRequestIndex + " > img").hasClass("gifImage")) {
            $("#loadedImageView > #uploadingImage" + uploadRequestIndex).remove();
        }
    }


    private updateSendingImageTemplate(data: UploadedImage) {
        if ($("#loadedImageView > #uploadingImage" + data.RequestIndex).length === 0) {//removed by timer
            this.addUploadingImageTemplate(parseInt(data.RequestIndex));
            this.updateSendingImageTemplate(data);
        } else {
            //TODO cancel timer
            $("#loadedImageView > #uploadingImage" + data.RequestIndex + " >img")
                .attr("src", "data:image/jpg;base64," + data.Image).removeClass("gifImage");
            $("#loadedImageView > #uploadingImage" + data.RequestIndex).attr("id", data.ImageFileName);
        }
    }

    private removeImageFromServer(fileName: string) {
        alert(fileName);
        let callParams = {
            FileNameToBeRemoved: fileName,
            NewAdGuid:this._currentNewAdGuid
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
        if (msg.Success == true) {
            this.showMessageToUser("done removing file from server");
            let fileName: string = msg.ResponseData;
            $(`[id="${fileName}"]`).remove();


        } else {
            this.showMessageToUser(msg.Message);
        }
    }

    private onErrorRemoveFileFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        this.showMessageToUser("error, " + errorThrown);
    }

    private showMessageToUser(msg) {
        $("#" + this.MessageToUserDivId).html(msg);
    }
}

class UploadedImage {
    public Image: string;
    public ImageFileName: string;
    public RequestIndex:string;
}