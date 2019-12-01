/* This function gets the user's input on the search bar which we will use to search our DB with
We have a toggle between "Food" and "Recipe". We store the user's choice in a variable called
food_or_recipe which we will later use in search.js to deciper which table to search.
*/
function search_foods_or_recipes() {

    var food_or_recipe = document.getElementById("food_or_recipe").value;
    var user_search_input = document.getElementById("user_input_search").value;

    //construct the URL and redirect to it
    window.location = '/search/' + encodeURI(food_or_recipe) + '/' + encodeURI(user_search_input);   
}

/*
Search function for the updates page
 */
function foodsForRecipeButton() {
    var user_search_input = document.getElementById("user_food_search").value;
    var id = document.getElementById("update_recipe_id").value;
    $.ajax({
        url: '/search/updateIngredients/food/' + id + '/' + user_search_input,
        type:'GET',
        success:function(result){
            console.log("AJAX result\n", result);
            var showFoodSource = $("#show_food_search_results").html();

            var template = Handlebars.compile(showFoodSource);

            $("#food_search_results").html(template(result));

            // bind click function to add food button on update ingredients page
            $(".addFoodToRecipeButton").click(function(){
                var food_id = $(this).attr('value');
                var recipe_id = document.getElementById("update_recipe_id").value;
        
                $.ajax({
                    url: '/search/updateIngredients/' + food_id + '/' + recipe_id,
                    type: 'post',
                    success: function(result){
                        console.log(result);
                        window.location.reload(true);
                    }
                })
            });
        }
    });

 
}


// UI function for a button to hide the display table when the user wants to see the ingredients of a recipe
function hideIngredientTable() {
    document.getElementById("displayIngredientsDiv2").style.display = "none";
    document.getElementById("displayIngredientsDiv").style.display = "none";
}

// UI function for a button to hide the form when the user wants to update a recipe's properties
function hideUpdateRecipeProp() {
    document.getElementById("updateProperties").style.display = "none";
    document.getElementById("updatePropertiesHideButton").style.display = "none";
}

// turns the Yes/No answers in the HTML to 1's and 0's for the Update Recipe button
function parseYesNo (word) {
    if (word === "Yes") {
        return 1;
    }
    else {
        return 0;
    }
}


// Mount functions (through AJAX and/or JQUERY) to specific buttons
$(document).ready(function(){

    $(".showIngredientsButton").click(function(){

        var currentRow = this.parentNode.parentNode.rowIndex;
        var button_name = document.getElementById("recipe_table").rows[currentRow].cells[9].innerText;
        var id = $(this).attr('value');

        // retrieve recipe id and redirect to it for route handler
        // window.location ='/search/' + $("#user_search_type").attr('value') + '/show/' + encodeURI($(this).attr('value')) + '/' + $("#user_search_text").attr('value');
        $.ajax({
            url: '/search/recipe/ingredients/' +  encodeURI(id),
            type: 'GET',
            success: function(result){
        
            var showIngredientSource = $("#showIngredientTemplate").html();

            console.log(showIngredientSource);
            console.log(result);

            var template = Handlebars.compile(showIngredientSource);

            $("#displayIngredientsDiv2").html(template(result));
            document.getElementById("displayIngredientsDiv").style.display = "block";
            document.getElementById("displayIngredientsDiv2").style.display = "block";

            }
        })
        


    });   

    // would like to change the window.location portion of this delete button
    $(".deleteRecipeButton").click(function(){
        $.ajax({
            url: '/search/delete/recipe/' + encodeURI($(this).attr('value')),
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })

    });

    $(".deleteFoodButton").click(function(){
        $.ajax({
            url: '/search/delete/food/' + encodeURI($(this).attr('value')),
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })

    });

    // Purely a DOM manipulation function to present the user choices for their update on
    // their chosen recipe
    $(".updateRecipePropButton").click(function(){


        // Grab name of recipe that the button is intended for
        var currentRow = this.parentNode.parentNode.rowIndex;
        var recipeName = document.getElementById("recipe_table").rows[currentRow].cells[0].innerHTML;

        // Attach the recipe name to the DOM for that stylage
        var parent_node = document.getElementById("updateProperties");
        var child_node = document.getElementById("updatePropertiesForm");
        var title = document.createElement("h2");
        var title_text = document.createTextNode("Update " + recipeName + "'s Recipe Properties");
        title.style.textAlign = "center";
        
        while (parent_node.childNodes.length > 0)
        {
            parent_node.removeChild(parent_node.childNodes[0]);
        }
        
        
        title.appendChild(title_text);
        parent_node.appendChild(title);
        title.appendChild(child_node);

        // IMPORTANT. Give the sendRecipeUpdate the correct recipe_id (i.e. value)
        // so that our DB knows which recipe to update
        document.getElementById("sendRecipeUpdate").value = $(this).attr('value');

        document.getElementById("updatePropertiesHideButton").style.display = "block";
        parent_node.style.display = "block";
    });

    // Create the sendRecipeUpdate function
    $("#sendRecipeUpdate").click(function(){
        //alert($(this).attr('value'));

        $.ajax({
            url: '/search/update_recipe/' + $(this).attr('value'),
            type: 'PUT',
            data: $('#updateRecipeForm').serialize(),
            success: function(result){
                window.location.reload(true);
            }
        })


    });

    // ADD FOOD w/ JQUERY AJAX
    $("#addFoodButton").click(function(){
        $.ajax({
        
            url:'/search/food',
            type:'POST',
            data: $('#addFoodForm').serialize(),
            success: function(result){
                window.location.reload(true);
            }
        })
        
    });


     // ADD RECIPE w/ JQUERY AJAX
     $("#addRecipeButton").click(function(){
        $.ajax({
        
            url:'/search/recipe',
            type:'POST',
            data: $('#addRecipeForm').serialize(),
            success: function(result){
                window.location.reload(true);
            }
        })
        
    });


    $(".updateIngredientsButton").click(function(){
        var id = $(this).attr('value');
        window.location = "/search/updateIngredients/" + encodeURI(id);
        

        // Tried to do AJAX but it wasn't working...
        /*
        var recipeData = {};

        // Grab current row of the button that was clicked
        var currentRow = this.parentNode.parentNode.rowIndex;
        var currentRowOfTable = document.getElementById("recipe_table").rows[currentRow];

        // formulate the data from the HTML table
        var recipeName = currentRowOfTable.cells[0].innerHTML;
        var recipeMeat = currentRowOfTable.cells[1].innerHTML;
        var recipeDairy = currentRowOfTable.cells[2].innerHTML;
        var recipeNuts = currentRowOfTable.cells[3].innerHTML;
        var recipeShellfish = currentRowOfTable.cells[4].innerHTML;
        var recipeCarbs = currentRowOfTable.cells[5].innerHTML;
        var recipeAnimalProd = currentRowOfTable.cells[6].innerHTML;
        var recipeGluten = currentRowOfTable.cells[7].innerHTML;
        var recipeSoy = currentRowOfTable.cells[8].innerHTML;

        recipeData.recipeName = recipeName;
        recipeData.recipeMeat = recipeMeat;
        recipeData.recipeDairy = recipeDairy;
        recipeData.recipeNuts = recipeNuts;
        recipeData.recipeShellfish = recipeShellfish;
        recipeData.recipeCarbs = recipeCarbs;
        recipeData.recipeAnimalProd = recipeAnimalProd;
        recipeData.recipeGluten = recipeGluten;
        recipeData.recipeSoy = recipeSoy;
        recipeData.id = id;
        console.log(recipeData);

        $.ajax({
        
            url:'/search/updateIngredient/' + id,
            type:'post',
            data: recipeData,
            success: function(result){
                console.log("Results", result);
                // window.location.href = "http://flip3.engr.oregonstate.edu:6750/updateIngredient/" + id;
            }
        })
        */
    });

    $(".removeFoodFromRecipeButton").click(function(){
        var food_id = $(this).attr('value');
        var recipe_id = document.getElementById("update_recipe_id").value;

        $.ajax({

            url: '/search/delete/ingredients/' + food_id + '/' + recipe_id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })
    });

});