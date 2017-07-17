using System.ServiceModel;
using Model.Advertisements;
using WcfService.Messages;
using System;
using System.Collections.Generic;
using System.ServiceModel.Web;

namespace WcfService.Services
{
    [ServiceContract]
    public interface IAdvertisementCommonService
    {
        //test
        [OperationContract]
        [WebInvoke(Method ="POST",BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string WhatTimeIsIt(string name);

        //test
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        string TestNameValue(string name, Dictionary<string,string> userDictionary);

        //Done
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
        ResponseBase<AdvertisementCommon[]> GetAdvertisementCommon(int startIndex, int count, Dictionary<string, string> userInput);
        
        //Done
        [OperationContract]
        ResponseBase<AdvertisementCommon[]> GetCustomerAdvertisementCommon(string userName,string password,bool userPassIsEncrypted);
        
        //Done
        [OperationContract]
        ResponseBase RemoveAdvertisement(AdvertisementCommon advertisementCommon);

        //Done
        [OperationContract]
        ResponseBase ExtendAdvertisement(AdvertisementCommon advertisement);

        ResponseBase IncrementNumberOfVisit(Guid adGuid);
        
        
        void FillFirstImage(AdvertisementCommon[] advertisementCommons);//Done
        void FillFirstImage(AdvertisementCommon advertisementCommon);//Done
        void FillAllImages(AdvertisementCommon[] advertisementCommons);//Done
        void FillAllImages(AdvertisementCommon advertisementCommon);//Done
        ResponseBase SaveAdImages(AdvertisementCommon advertisementCommon); //Done
    }
}