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


// Mount functions (through AJAX or JQUERY) to specific buttons
$(document).ready(function(){
    $(".showIngredientsButton").click(function(){

        // retrieve recipe id and redirect to it for route handler
        window.location ='/search/' + $("#user_search_type").attr('value') + '/show/' + encodeURI($(this).attr('value')) + '/' + $("#user_search_text").attr('value');

      });   

    // would like to change the window.location portion of this delete button
    $(".deleteRecipeButton").click(function(){
        $.ajax({
            url: '/search/delete/recipe/' + encodeURI($(this).attr('value')),
            type: 'DELETE',
            success: function(result){
                window.location = '/search/';
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
        var title = document.createElement("h3");
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

        document.getElementById("updatePropertiesForm").style.display = "block";
        document.getElementById("updatePropertiesForm").style.fontWeight = "normal";
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
    
});