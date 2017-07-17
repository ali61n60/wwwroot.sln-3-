using Model;

namespace Repository.Messages
{
    
    public  class RepositoryResponse:RepositoryResponseBase
    {
        public Customer Customer { get; set; }
    }
}
