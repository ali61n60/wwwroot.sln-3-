import {UserInput} from "../../../Helper/UserInput";

export class LetMeKnowServerCaller {
    //TODO call server and send userinput fro new ad
    //get result and show to user
    private readonly _url: string = "/api/LetMeKnowApi/AddNewLetMeKnowRecord";
    private readonly MessageDivId: string ="message";


    public SaveAd(userInput: UserInput): void {
        $.ajax({
            type: "POST", //GET or POST or PUT or DELETE verb
            url: this._url,
            data: JSON.stringify(userInput.ParametersDictionary), //Data sent to server
            contentType: 'application/json', // content type sent to server
            success: (msg, textStatus, jqXHR) => this.onSuccessGetItemsFromServer(msg, textStatus, jqXHR), //On Successfull service call
            error: (jqXHR, textStatus, errorThrown) => this.onErrorGetItemsFromServer(jqXHR, textStatus, errorThrown) // When Service call fails
        }); //.ajax
    }

    private onSuccessGetItemsFromServer(msg: any, textStatus: string, jqXHR: JQueryXHR) {
        //TODO redirect user to a new page
        if (msg.Success == true) {
            document.location.replace("/LetMeKnow/Confirm");
        } else {
            //$("#" + this.MessageDivId).children().remove();
            $("#" + this.MessageDivId).html("<p>"+msg.Message+ " ,"+msg.ErrorCode+"</p>");
        }
    }


    private onErrorGetItemsFromServer(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
        //TODO inform error to user
    } 
}