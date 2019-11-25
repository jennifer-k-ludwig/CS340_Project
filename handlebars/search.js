module.exports = function() {

	var express = require('express');
    var router = express.Router();

	// Searches the user's input
	function searchInput(req, res, mysql, context, complete){
		// get the user's selection
		var user_search = req.params.s;

		// check whether they selected food or recipe
		// query string will be in the form of "food" + "(user input)" OR "recipe" + "(user input)".
		if (user_search.substring(0,4) === "food")
		{
			user_search = user_search.substring(4);
			var query = "SELECT * FROM foods WHERE foods.food_name LIKE " + mysql.pool.escape('%' + user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Food Results");
				console.log(results);
				console.log('\n');

				parseFoodResults(results);

				// set display_food to true so that search.handlebars displays
				// the food table
				context.display_food = true;

				context.food = results;
				complete("food");
	
			});
		}
		else if (user_search.substring(0,6) === "recipe")
		{
			user_search = user_search.substring(6);
			var query = "SELECT * FROM recipes WHERE recipes.recipe_name LIKE " + mysql.pool.escape('%' + user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Recipe Results");
				console.log(results);
				console.log('\n');

				parseRecipeResults(results);

				// set display_recipe to true so that search.handlebars displays
				// the recipe table
				context.display_recipe = true;

				context.recipe = results;
				complete("recipe");
	
			});
		}

	}
	
	// changes the 1s and 0s of the Food Query to Yes/No
	function parseFoodResults(results) {
		results.forEach(element => {
			if (element.contains_meat === 1) element.contains_meat = "Yes";
			else element.contains_meat = "No";

			if (element.contains_dairy === 1) element.contains_dairy = "Yes";
			else element.contains_dairy = "No";

			if (element.contains_nuts === 1) element.contains_nuts = "Yes";
			else element.contains_nuts = "No";

			if (element.contains_shellfish === 1) element.contains_shellfish = "Yes";
			else element.contains_shellfish = "No";

			if (element.contains_carbs === 1) element.contains_carbs = "Yes";
			else element.contains_carbs = "No";

			if (element.contains_animal_products === 1) element.contains_animal_products = "Yes";
			else element.contains_animal_products = "No";

			if (element.contains_gluten === 1) element.contains_gluten = "Yes";
			else element.contains_gluten = "No";

			if (element.contains_soy === 1) element.contains_soy = "Yes";
			else element.contains_soy = "No";
		});
	}

	// changes the 1s and 0s of the Recipe Query to Yes/No
	function parseRecipeResults(results) {
		results.forEach(element => {
			if (element.recipe_no_meat === 0) element.recipe_no_meat = "Yes";
			else element.recipe_no_meat = "No";

			if (element.recipe_no_dairy === 0) element.recipe_no_dairy = "Yes";
			else element.recipe_no_dairy = "No";

			if (element.recipe_no_nuts === 0) element.recipe_no_nuts = "Yes";
			else element.recipe_no_nuts = "No";

			if (element.recipe_no_shellfish === 0) element.recipe_no_shellfish = "Yes";
			else element.recipe_no_shellfish = "No";

			if (element.recipe_no_carbs === 0) element.recipe_no_carbs = "Yes";
			else element.recipe_no_carbs = "No";

			if (element.recipe_no_animal_products === 0) element.recipe_no_animal_products = "Yes";
			else element.recipe_no_animal_products = "No";

			if (element.recipe_no_gluten === 0) element.recipe_no_gluten = "Yes";
			else element.recipe_no_gluten = "No";

			if (element.recipe_no_soy === 0) element.recipe_no_soy = "Yes";
			else element.recipe_no_soy = "No";
		});
	}
	
	// render initial search page
	router.get('/', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
	

		res.render('search', context);

        
		
	});

	// render search page after searching
	router.get('/:s', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
		searchInput (req, res, mysql, context, complete);
		function complete(food_or_recipe){
			callbackCount++;
			if(callbackCount >= 1){
				if (food_or_recipe === "food")
				{	
					res.render('search', context);
				}
				else res.render('search', context);
			}

		}
		
	});
	return router;
}();