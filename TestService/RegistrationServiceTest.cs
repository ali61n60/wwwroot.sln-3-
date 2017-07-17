using NUnit.Framework;


namespace TestService
{
    /// <summary>
    /// Summary description for RegistrationServiceTest
    /// </summary>
    [TestFixture()]
    public class RegistrationServiceTest
    {
        [Test]
        public void IsUsernameInCorrectFormatTest()
        {
            WcfService.Services.RegistrationService registrationService=new WcfService.Services.RegistrationService();
            bool flaseResult= registrationService.IsEmailAddressInCorrectFormat("aaa.com");
            bool trueResult = registrationService.IsEmailAddressInCorrectFormat("aaa@a.com");
            bool trueResult2 = registrationService.IsEmailAddressInCorrectFormat("ali62n62@yahoo.com");
            Assert.AreEqual(false,flaseResult);
            Assert.AreEqual(true,trueResult);
            Assert.AreEqual(true, trueResult2);
        }

        [Test]
        public void IsPhoneNumberInCorrectFormatTest()
        {
            WcfService.Services.RegistrationService registrationService = new WcfService.Services.RegistrationService();
            bool falseResult = registrationService.IsPhoneNumberInCorrectFormat("091220129081");
            bool falseResult2 = registrationService.IsPhoneNumberInCorrectFormat("091220");

            Assert.AreEqual(false,falseResult);
            Assert.AreEqual(false, falseResult2);
        }
    }
}
