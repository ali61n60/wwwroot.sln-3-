export interface IResultHandler<T> {
    OnResultOk(t:T): void;
    OnResultError(message:string):void;
}

