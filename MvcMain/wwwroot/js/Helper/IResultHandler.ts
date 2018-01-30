export interface IResultHandler {
    OnResult(param:any,requestCode:number): void;
    OnError(message: string, requestCode: number): void;
    AjaxCallFinished(requestCode: number): void;
    AjaxCallStarted(requestCode: number):void;
}

