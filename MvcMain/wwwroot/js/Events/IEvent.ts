/** Models an event with a generic sender and generic arguments */
export  interface IEvent<TSender, TArgs> {
    Subscribe(fn: (sender: TSender, args: TArgs) => void): void;
    Unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
}