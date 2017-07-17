using System;
using NUnit.Framework.Constraints;

namespace Model.Stack
{
    public interface IStack
    {
        bool IsEmpty();
        int GetSize();
        void Push(int element);
        int Pop();
        int Top();
        Integer Find(int element);
    }

    public class OverFlow : ApplicationException { }

    public class UnderFlow : ApplicationException { }

    public class IlligalCapacity : ApplicationException { }

    public class Empty : ApplicationException { }

    public class Integer
    {
        public override int GetHashCode()
        {
            return intValue;
        }

        public Integer(int value)
        {
            intValue = value;
        }
        public int intValue { get; private set; }

        public static bool operator ==(Integer a, int b)
        {
            return a.intValue == b;
        }

        public static bool operator !=(Integer a, int b)
        {
            return !(a == b);
        }

        protected bool Equals(Integer other)
        {
            return intValue == other.intValue;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Integer)obj);
        }
    }
}