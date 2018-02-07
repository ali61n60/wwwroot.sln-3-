namespace ChiKoja.AdDetail
{
    public interface IAdDetailCallBack<T>
    {
        void DataFromServer(T t);
    }
}