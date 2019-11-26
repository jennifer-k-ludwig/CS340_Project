module.exports = function() {

	var express = require('express');
    var router = express.Router();

	// Searches the user's input
	function searchInput(req, res, mysql, context, complete){
		// get the user's selection
		var user_search_type = req.params.type;
		if(!req.params.food_or_recipe_name) 
		{
			var user_search_text = '';
		} 
		else var user_search_text = req.params.food_or_recipe_name;

		// check whether they selected food or recipe
		// query string will be in the form of "food" + "(user input)" OR "recipe" + "(user input)".
		if (user_search_type === "food")
		{
			var query = "SELECT * FROM foods WHERE foods.food_name LIKE " + mysql.pool.escape('%' + user_search_text + '%');
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

				context.user_search_type = user_search_type;
				context.user_search_text = user_search_text;

				context.food = results;
				complete();
	
			});
		}
		else if (user_search_type === "recipe")
		{
			var query = "SELECT * FROM recipes WHERE recipes.recipe_name LIKE " + mysql.pool.escape('%' + user_search_text + '%');
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

				context.user_search_type = user_search_type;
				context.user_search_text = user_search_text;

				context.recipe = results;
				complete();
	
			});
		}

	}
	
	// probably need to make this cleaner when finished
	function recipe_show_add_delete(req, res, mysql, context, complete) {

		// SHOW INGREDIENTS FUNCTIONALITY
		var user_selection = req.params.user_choice;
		if (user_selection === "show") {
			var recipeID = req.params.id;
			var query = "SELECT food_name, recipe_name, calories_ounce FROM (recipes INNER JOIN (SELECT * FROM foods_recipes INNER JOIN foods ON foods_recipes.food = foods.food_id) as t1 ON t1.recipe = recipes.recipe_id) where recipe_id = ?";
			mysql.pool.query(query, recipeID, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}

				console.log("Show Ingredient of a specific Recipe Results");
				console.log(results);
				console.log('\n');

				// set display_ingredients to true so that search.handlebars displays
				// the recipe table
				if (Array.isArray(results) && results.length > 0) {
					context.display_ingredients = true;
					context.user_recipe = results[0].recipe_name;
					context.ingredient = results;
					complete();
				}
				else {

					context.no_display_ingredients = true;
					mysql.pool.query("SELECT recipe_name FROM recipes where recipe_id = ?", recipeID, function(error, results, fields){
						if(error){
							res.write(JSON.stringify(error));
							res.end();
						}
	
						console.log("Recipe Name");
						console.log(results);
	
						context.user_recipe = results[0].recipe_name;
						
						complete();
					});
				}
			
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

	// render search page after user wants to show ingredients
	router.get('/recipe_builder', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
		context.display_food_search = true;
		var user_inputs = []
		res.render('search',context);
		
		
	});

	// render search page after user wants to show ingredients
	router.get('/:type/:user_choice/:id/:food_or_recipe_name?', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
		recipe_show_add_delete(req, res, mysql, context, complete);
		searchInput (req, res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('search', context);
			}

		}
		
	});

	// render search page after searching
	router.get('/:type/:food_or_recipe_name?', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
		searchInput (req, res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('search', context);
			}

		}
		
	});


	// Add a food to our DB
	router.post('/food', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO foods (food_name, calories_ounce, contains_meat, contains_dairy, contains_nuts, contains_shellfish, contains_carbs, contains_animal_products, contains_gluten, contains_soy) VALUES (?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.add_food_name, 
			req.body.add_food_calories, 
			req.body.add_food_meat, 
			req.body.add_food_dairy,
			req.body.add_food_nuts,
			req.body.add_food_shellfish,
			req.body.add_food_carbs,
			req.body.add_food_animal,
			req.body.add_food_gluten,
			req.body.add_food_soy];
		console.log(req.body);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/search/food');
            }
        });
	});

	// Add a recipe to our DB
	router.post('/recipe', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO recipes (recipe_name, recipe_no_meat, recipe_no_dairy, recipe_no_nuts, recipe_no_shellfish, recipe_no_carbs, recipe_no_animal_products, recipe_no_gluten, recipe_no_soy) VALUES (?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.add_recipe_name, 
			req.body.add_recipe_calories, 
			req.body.add_recipe_meat, 
			req.body.add_recipe_dairy,
			req.body.add_recipe_nuts,
			req.body.add_recipe_shellfish,
			req.body.add_recipe_carbs,
			req.body.add_recipe_animal,
			req.body.add_recipe_gluten,
			req.body.add_recipe_soy];
		console.log(req.body);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/search/recipe');
            }
        });
	});

	// UPDATE OUR RECIPES in OUR DB
    router.put('/update_recipe/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE recipes SET recipe_no_meat=?, recipe_no_dairy=?, recipe_no_nuts=?, recipe_no_shellfish=?, recipe_no_carbs=?, recipe_no_animal_products=?, recipe_no_gluten=?, recipe_no_soy=?  WHERE recipe_id=?";
		var inserts = [req.body.update_recipe_meat, 
			req.body.update_recipe_dairy, 
			req.body.update_recipe_nuts, 
			req.body.update_recipe_shellfish, 
			req.body.update_recipe_carbs, 
			req.body.update_recipe_animal, 
			req.body.update_recipe_gluten, 
			req.body.update_recipe_soy, 
			req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });	


    router.delete('/delete/:type/:id', function(req, res){
        var mysql = req.app.get('mysql');
		
		if(req.params.type === "recipe")
			var sql = "DELETE FROM recipes WHERE recipe_id = ?";
		else if (req.params.type === "food")
			var sql = "DELETE FROM foods WHERE food_id = ?";

        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
	})
	
	return router;
}();