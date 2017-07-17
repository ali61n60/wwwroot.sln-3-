<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SearchCriteriaAdTransportationControl.ascx.cs" Inherits="WebUIMain.UserControls.SearchCritetria.SearchCriteriaAdTransportationControl" %>

<script src="../../StyleScript/jquery-1.11.3.js"></script>
<script src="../../StyleScript/mustache.js"></script>
<script>
    //raise searchCriteriaChanged event  
</script>

<script id="brandTemplate" type="text/template">    
        <select id='brandSelect' class="form-control">
            <option value="0">تمام برندها</option>
            {{#AllBrands}}
        <option value='{{BrandId}}'>{{BrandName}} </option>
            {{/AllBrands}}
        </select>
</script>

<script id="modelTemplate" type="text/template">
    <select id='modelSelect' class="form-control">
            <option value="0">تمام مدلها</option>
            {{#AllModels}}
        <option value='{{ModelId}}'>{{ModelName}} </option>
            {{/AllModels}}
        </select>
</script>

<div class="row">
    <div class="col-sm-4">
        <span id="BrandSelect" class="BrandSelect" runat="server" ></span>
    </div>
    <div class="col-sm-4 ">
       <span id="ModelSelect" class="ModelSelect" runat="server" ></span>
    </div>

    <div class="col-sm-4">
        
    </div>
</div>

