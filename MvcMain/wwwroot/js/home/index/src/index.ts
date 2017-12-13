import {Category,CategorySelection} from "../../../Components/CategorySelection";
import { ServerCaller } from "./ServerCaller";

class Index {
    public  serverCaller = new ServerCaller();
    public  categorySelection: CategorySelection;

    constructor() {
        $(document).ready( ()=> {
            this.initCategorySelectionControl(this.categorySelection);
            this.initGetAdFromServer();
        });//ready

       

        $(document).ready(function () {

            //show detail of singleAdItem when mouse over
            $(document).on("mouseenter mouseleave", ".blockDisplay", function () {
                $(this).find(".moreInfo").fadeToggle(250);
            });//end on

        });//end ready

    }

    private  initCategorySelectionControl(categorySelection: CategorySelection): void {
        //Add first level categories
        var allCategoriesString = $("#allCategories").val().toString();
        var allCategories = $.parseJSON(allCategoriesString) as Category[];
        categorySelection = new CategorySelection("categorySelector", allCategories);
        categorySelection.SelectedCategoryChanged.Subscribe((sender, args) => {
            alert("selected category changed " + args);
        });
        categorySelection.CreateFirstLevel();
    }

    private initGetAdFromServer() {
        $("#getAdFromServer").on("click", (event) => {
            event.preventDefault();

            let categoryId = this.categorySelection.GetSelectedCategoryId();
            let minPrice = parseInt($("#minPrice").val().toString());
            let maxPrice = parseInt($("#maxPrice").val().toString());
            let orderBy = $("#orderBy").val().toString();

            this.serverCaller.GetAdItemsFromServer(categoryId, minPrice, maxPrice, orderBy);
        }); //click
    }
}

let index = new Index();








