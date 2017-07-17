using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WcfService.ServicePolicy
{
    class ServiceCommonPolicy
    {
        private int _maximumNumberOfAdsPerCall = 20;
        private int _minimumNumberOfAdsPerCall = 1;

        public int getStart(int sugestedStart)
        {
            if (sugestedStart < 0)
                return 0;
            return sugestedStart;
        }

        public int getCount(int sugestedCount)
        {
            if (sugestedCount > _maximumNumberOfAdsPerCall)
                return  _maximumNumberOfAdsPerCall;
            if (sugestedCount < _minimumNumberOfAdsPerCall)
                return _maximumNumberOfAdsPerCall;
            return sugestedCount;
        }
    }
}
