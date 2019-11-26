
/* This function gets the user's input on the search bar which we will use to search our DB with
We have a toggle between "Food" and "Recipe". We store the user's choice in a variable called
food_or_recipe which we will later use in search.js to deciper which table to search.
*/
function search_foods_or_recipes() {

    var food_or_recipe = document.getElementsByName("food_or_recipe")[0].value;
    var user_search_input = document.getElementsByName("user_input_search")[0].value;

    //construct the URL and redirect to it
    window.location = '/search/' + encodeURI(food_or_recipe + user_search_input);   
}


