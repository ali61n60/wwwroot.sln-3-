namespace MvcMain.Infrastructure.ServicePolicy
{
    class ServiceCommonPolicy
    {
        private int _maximumCount = 20;
        private int _minimumCount = 1;

        public int StartIndexInRange(int sugestedStartIndex)
        {
            if (sugestedStartIndex < 0)
                return 0;
            return sugestedStartIndex;
        }

        public int CountInRange(int sugestedCount)
        {
            if (sugestedCount > _maximumCount)
                return  _maximumCount;
            if(sugestedCount < _minimumCount)
                return _minimumCount;
            return sugestedCount;
        }
    }
}
