using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace Model.Stack
{
    [TestFixture]
    class StackTest
    {
        private IStack _stack;

        [SetUp]
        public void Setup()
        {
            _stack = BoundedStack.Make(2);
        }
        [Test]
        public void NewlyCreatedStack_ShouldBeEmpty()
        {
            Assert.That(_stack.IsEmpty(), Is.EqualTo(true));
            Assert.That(_stack.GetSize(), Is.EqualTo(0));
        }

        [Test]
        public void AfterOnePush_StackSizeShouldBeOne()
        {
            _stack.Push(1);
            Assert.That(_stack.GetSize(), Is.EqualTo(1));
            Assert.That(_stack.IsEmpty(), Is.EqualTo(false));
        }

        [Test]
        public void AfterOnePushAndOnePop_ShouldBeEmpty()
        {
            _stack.Push(1);
            _stack.Pop();
            Assert.That(_stack.IsEmpty(), Is.EqualTo(true));
        }

        [Test]
        public void WhenPushPassesLimit_StackOverflows()
        {
            Assert.Throws<OverFlow>(delegate
            {
                _stack.Push(1);
                _stack.Push(2);
                _stack.Push(3);
            });
        }

        [Test]
        public void WhenEmptyStackIsPoped_StackUnderflows()
        {
            Assert.Throws<UnderFlow>(delegate
            {
                _stack.Pop();
            });
        }

        [Test]
        public void WhenOneIsPushedOneIdPoped()
        {
            _stack.Push(1);
            Assert.That(_stack.Pop(), Is.EqualTo(1));
        }

        [Test]
        public void WhenOneandTwoArePushed_TwoAndOneArePoped()
        {
            _stack.Push(1);
            _stack.Push(2);
            Assert.That(_stack.Pop(), Is.EqualTo(2));
            Assert.That(_stack.Pop(), Is.EqualTo(1));
        }

        [Test]
        public void WhenCreatingStackWithNegativeSize_ShouldThrowIlligalCapacity()
        {
            Assert.Throws<IlligalCapacity>(delegate
            {
                _stack = BoundedStack.Make(-1);
            });
        }

        [Test]
        public void WhenCreatingStackWithZeroCapacity_AnyPushShouldOverFlow()
        {
            Assert.Throws<OverFlow>(delegate
            {
                _stack=BoundedStack.Make(0);
                _stack.Push(1);
            });
        }

        [Test]
        public void WhenOneIsPushed_OneIsOnTop() 
        {
            _stack.Push(1);
            Assert.That(_stack.Top(), Is.EqualTo(1));
        }

        [Test]
        public void WhenStackIsEmpty_TopThrowsEmpty()
        {
            Assert.Throws<Empty>(
                delegate
                {
                    _stack.Top();
                }
            );
        }

        [Test]
        public void WithZeroCapacityStack_TopThrowsEmpty()
        {
            _stack = BoundedStack.Make(0);
            Assert.Throws<Empty>(delegate
            {
                _stack.Top();
            });
        }

        [Test]
        public void GivenStackWithOneTwoPushed_FindOneAndTwo() 
        {
            _stack.Push(1);
            _stack.Push(2);
            Assert.That(_stack.Find(1).intValue, Is.EqualTo(1));
            Assert.That(_stack.Find(2).intValue,Is.EqualTo(0));
        }

        [Test]
        public void GivenStackWithNo2_Find2ShouldReturnMinus1()
        {
            _stack.Push(1);
            _stack.Push(3);
            Assert.That(_stack.Find(2),Is.Null);
        }

          
    }

    
}
