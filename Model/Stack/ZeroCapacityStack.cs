using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Stack
{
    class ZeroCapacityStack : IStack
    {
        public bool IsEmpty()
        {
            return true;
        }

        public int GetSize()
        {
            return 0;
        }

        public void Push(int element)
        {
            throw new OverFlow();
        }

        public int Pop()
        {
            throw new UnderFlow();
        }

        public int Top()
        {
            throw new Empty();
        }

        public Integer Find(int element)
        {
            return null;
        }
    }

    
}
