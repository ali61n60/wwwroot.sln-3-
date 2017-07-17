using System;
using NUnit.Framework;

namespace Model.Stack
{
    class BoundedStack : IStack
    {
        private int _size;
        private readonly int _capacity;
        private int[] _elements; 

        public static IStack Make(int capacity)
        {
            if (capacity == 0)
                return new ZeroCapacityStack();
            if (capacity < 0)
                throw new IlligalCapacity();
            return new BoundedStack(capacity);
        }

        private BoundedStack(int capacity)
        { 
            _capacity = capacity;
            _elements=new int[capacity];
            _size = 0;
        }
        public bool IsEmpty()
        {
            return (_size == 0);
        }

        public int GetSize()
        {
            return _size;
        }

        public void Push(int element) 
        {
            if (_size == _capacity)
                throw new OverFlow();
            _elements[_size++] = element;
        }

        public int Pop()
        {
            if(IsEmpty())
                throw new UnderFlow();
            return _elements[--_size];
        }

        public int Top()
        {
            if(IsEmpty())
                throw new Empty();
            return _elements[(_size - 1)];
        }

        public Integer Find(int element)
        {
            for(int i=(_size-1);i>=0;i--)
                if ( _elements[i] == element )
                    return new Integer( _size - i - 1) ;
            return null;
        }
    }
}
