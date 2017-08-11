using System;
using ModelStd.Advertisements;
using ModelStd.Services;

namespace ChiKoja.Services
{
    public interface ISearchAdResult<T>
    {
        void OnSerachAdCompleted(ResponseBase<T> response);
        void OnSearchAdError(Exception ex);
    }
}