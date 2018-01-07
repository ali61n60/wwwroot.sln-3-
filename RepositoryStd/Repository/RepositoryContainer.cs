using System.Collections.Generic;
using ModelStd.IRepository;

namespace RepositoryStd.Repository
{
    public class RepositoryContainer
    {
        private readonly Dictionary<int,IAdRepository> _container=new Dictionary<int, IAdRepository>();
        private readonly int _defaultCategoryId;

        public RepositoryContainer(int defaultCategoryId)
        {
            _defaultCategoryId = defaultCategoryId;
        }

        public void RegisterRepository(int categoryId, IAdRepository adRepository)
        {
            _container[categoryId] = adRepository;
        }

        public IAdRepository GetAdRepository(int categoryId)
        {
            if (_container.ContainsKey(categoryId))
                return _container[categoryId];
            if(_container.ContainsKey(_defaultCategoryId))
                return _container[_defaultCategoryId];
           
            return null;
        }

    }
}
