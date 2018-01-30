export interface IResultHandler<T> {
    OnResult(t:T): void;
    OnError(message: string): void;
    AjaxCallFinished(): void;
    AjaxCallStarted():void;
}

