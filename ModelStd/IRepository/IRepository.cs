using System;
using System.Collections.Generic;

namespace ModelStd.IRepository
{
    //TODO to be removed
    public interface IRepository<T>
    {
        T FindBy(Guid id);//in progress
        
        IEnumerable<T> FindAll();//to Be Studied
        
        
    }
}
