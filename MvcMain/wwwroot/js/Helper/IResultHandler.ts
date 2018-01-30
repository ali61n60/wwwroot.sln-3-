export interface IResultHandler {
    OnResult(param:any): void;
    OnError(message: string): void;
    AjaxCallFinished(): void;
    AjaxCallStarted():void;
}

