import {IResultHandler} from "./IResultHandler";
import {AjaxCaller} from "./AjaxCaller";

export class BaseServerCaller implements IResultHandler {
    private readonly RequestIndexKey: string = "RequestIndex";
    private _currentRequestIndex: number = 0;

    private _url: string = "";

    protected _resultHandler: IResultHandler;
    protected _ajaxCaller: AjaxCaller;

    constructor(resultHandler: IResultHandler,url:string ,requestCode: number) {
        this._resultHandler = resultHandler;
        this._url = url;
        this._ajaxCaller = new AjaxCaller(this._url, this, requestCode);
    }

    
    public OnResult(param: any, requestCode: number): void {
        throw new Error("Method not implemented.");
    }
    public OnError(message: string, requestCode: number): void {
        throw new Error("Method not implemented.");
    }
    public  AjaxCallFinished(requestCode: number): void {
        throw new Error("Method not implemented.");
    }
    public  AjaxCallStarted(requestCode: number): void {
        throw new Error("Method not implemented.");
    }

}