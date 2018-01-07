﻿/*
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
        T FindBy(Guid Id);//in progress
        
        void Remove(T entity);//Done
        void Save(T entity);//Update Database
        IEnumerable<T> GetUserAdvertisements(string userEmail);//In Progress
        IEnumerable<T> FindAll();//to Be Studied
        
        
    }
}
