/*
 * Classes that implement this interface
 * 1- Must throw an exception in case of ERROR
 * 
 * 
 * 
 * */

using System;
using System.Collections.Generic;


namespace ModelStd.IRepository
{
    public interface IRepository<T>
    {
        IEnumerable<T> FindBy(Dictionary<string, string> queryParameters);//Done
        IEnumerable<T> FindBy(Dictionary<string,string> queryParameters, int startIndex, int count);//Done
        void Add(T entity);//Insert Database  //Done
        void Remove(T entity);//Done
        void Save(T entity);//Update Database  //Done
        IEnumerable<T> GetUserAdvertisements(string username);//In Progress

        IEnumerable<T> FindAll();//to Be Studied
        T FindBy(Guid Id);//to Be Studied
        void IncrementNumberOfVisit(Guid adGuid);
    }
}
