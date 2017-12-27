using System.Collections.Generic;
using ModelStd.IRepository;

namespace RepositoryStd.Repository
{
    public class RepositoryContainer
    {
        private readonly Dictionary<int,IFindRepository> _container=new Dictionary<int, IFindRepository>();
        private int _defaultCategoryId;

        public RepositoryContainer(int defaultCategoryId)
        {
            _defaultCategoryId = defaultCategoryId;
        }

        public void RegisterRepository(int categoryId, IFindRepository findRepository)
        {
            _container[categoryId] = findRepository;
        }

        public IFindRepository GetFindRepository(int categoryId)
        {
            if (_container.ContainsKey(categoryId))
                return _container[categoryId];
            if(_container.ContainsKey(_defaultCategoryId))
                return _container[_defaultCategoryId];
           
            return null;
        }

    }
}
