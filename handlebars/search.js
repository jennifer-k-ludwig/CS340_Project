module.exports = function() {

	var express = require('express');
     var router = express.Router();


	// Helper function to get query results from the user's search
     function searchInput(req, res, mysql, session, context, complete) {

		// hold the user's search type in this variable. This will either be "food" or "recipe"
          var user_search_type = req.params.type;

          // get the user's selection
          // if their selection was blank set their text value to '', otherwise, use the text they provided.
		if(!req.params.food_or_recipe_name) 
		{
			var user_search_text = '';
		} 
		else var user_search_text = req.params.food_or_recipe_name;

		// if the user searched for foods, then this if statement will be satisfied
		if (user_search_type === "food")
          {
               // query for to select all foods from the foods table that match the user's diet preferences.
			var query = "SELECT * FROM foods INNER JOIN diets ON contains_meat<>diet_no_meat AND contains_dairy<>diet_no_dairy AND contains_nuts<>diet_no_nuts AND contains_shellfish<>diet_no_shellfish AND contains_carbs<>diet_no_carbs AND contains_animal_products<>diet_no_animal_products AND contains_gluten<>diet_no_gluten AND contains_soy<>diet_no_soy WHERE diet_id=? AND food_name LIKE" + mysql.pool.escape('%' + user_search_text + '%');
			var inserts = [req.session.diet_id];
			mysql.pool.query(query, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else {

                         // This helper function changes the 1s and 0s of the boolean values into Yes's and No's
					parseFoodResults(results);

					// set display_food to true so that search.handlebars displays the food table and the add food form
					context.display_food = true;

                         // store these attributes just in case we need them (this won't affect anything for the time being)
					context.user_search_type = user_search_type;
					context.user_search_text = user_search_text;

                         // store the query results in a food data variable.
                         context.food = results;

					complete();
				}
			});
          }

          // if the user searched for recipes, then this if statement will be satisfied
		else if (user_search_type === "recipe")
          {
               // query for to select all recipes from the recipes table that match the user's diet preferences.
			var query = "SELECT * FROM recipes INNER JOIN diets ON recipe_no_meat=diet_no_meat AND recipe_no_dairy=diet_no_dairy AND recipe_no_nuts=diet_no_nuts AND recipe_no_shellfish=diet_no_shellfish AND recipe_no_carbs=diet_no_carbs AND recipe_no_animal_products=diet_no_animal_products AND recipe_no_gluten=diet_no_gluten AND recipe_no_soy=diet_no_soy WHERE diet_id=? AND recipe_name LIKE " + mysql.pool.escape('%' + user_search_text + '%');
			var inserts = [req.session.diet_id];
			mysql.pool.query(query, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else 
				{
                         // This helper function changes the 1s and 0s of the boolean values into Yes's and No's
					parseRecipeResults(results);

					// set display_recipe to true so that search.handlebars displays the recipe table and the add recipe form
					context.display_recipe = true;

                         // store these attributes just in case we need them (this won't affect anything for the time being)
					context.user_search_type = user_search_type;
					context.user_search_text = user_search_text;

                         // store the query results in a recipe data variable.
                         context.recipe = results;

					complete();
				}
			});
		}

	}
	
	// Helper function to show a recipe's ingredients (i.e. foods associated with a recipe)
	function recipe_show_ingredients(req, res, mysql, context, complete) {

		// grab the recipeID from the client end	
          var recipeID = req.params.id;

          // query to select the foods that are associated with the specific recipe the user is interested in
		var query = "SELECT food_name, recipe_name, calories_ounce, food_id, contains_meat, contains_dairy, contains_nuts, contains_shellfish, contains_carbs, contains_animal_products, contains_gluten, contains_soy FROM (recipes INNER JOIN (SELECT * FROM foods_recipes INNER JOIN foods ON foods_recipes.food = foods.food_id) as t1 ON t1.recipe = recipes.recipe_id) where recipe_id = ?";
		mysql.pool.query(query, recipeID, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else 
               {
                    // Change the 1's and 0's of the boolean properties into Yes's and No's for client side
				parseFoodResults(results);

				// if the query is not the empty set then this if statement applies.
                    // we set the display_ingredients to true for handlebars to display the table we have in search.handlebars
                    // we grab the recipe name for handlebars as well as the query result for handlebars to render.
				if (Array.isArray(results) && results.length > 0) {
					context.display_ingredients = true;
					context.user_recipe = results[0].recipe_name;
					context.ingredient = results;
					complete();
				}

				else 
				{
					// if the above query is the empty set we grab the recipe name for handlebars
					mysql.pool.query("SELECT recipe_name FROM recipes where recipe_id = ?", recipeID, function(error, results, fields){
						if(error){
							res.write(JSON.stringify(error));
							res.end();
						}
						else 
                              {
							context.user_recipe = results[0].recipe_name;
							complete();
						}
					});
				}
			}
		});
		
	}

     // Helper function to help build the recipe info we need to render updateIngredients.handlebars
     // this function will grab all of a specific recipe's properties so that we can use it in updateIngredients.handlebars
	function buildRecipe(req, res, mysql, context, complete){
		var query = "SELECT * from recipes where recipe_id = ?";
		var recipeID = req.params.id;
		mysql.pool.query(query, recipeID, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {
				parseRecipeResults(results);
				context.recipe = results;
			}
		});
		
		context.id = req.params.id;
		complete();
	}

     // Helper function for the search feature on the updateIngredients.handlebars page
     // It will search for all the foods that are not associated with a particular recipe
	function updateIngredientsSearch(req, res, mysql, context){
		context.id = req.params.id;

          // This if-else statement ensures that if the user does not enter anything in the search bar then we set the search_text variable to '' so our query can run.
		var search_text;
		if(!req.params.user_search_text) 
		{
			search_text = '';
		} 
		else search_text = req.params.user_search_text;

          // query code to select all foods from the foods table such that each food is not associated with a recipe
		var query = "SELECT * from (SELECT * from foods WHERE food_id NOT IN (SELECT food from foods_recipes WHERE recipe = ?)) as t1 WHERE food_name LIKE " + mysql.pool.escape('%' + search_text + '%');
		var recipeID = req.params.id;
		mysql.pool.query(query, recipeID, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else {

                    // This helper function changes all the 1s and 0s to Yes's and No's
				parseFoodResults(results);

				// set display_food to true so that search.handlebars displays the food table
				context.display_food = true;

                    // store this info for data purposes
				context.user_search = search_text;

				context.food = results;
				console.log("Context Result\n",context);

				res.send(context);
			}
			
		});
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
	
     // if the user has not logged in, make them do so	
     router.all('*', function (req, res, next) {
          if (req.session.user_id === undefined) {
               console.log("redirect worked");
               res.redirect('/login')
          }
          else {
               next();
          }
     });

	// render initial search page
     router.get('/', function (req, res) {

          var callbackCount = 0;
          var context = {};
          context.jsscripts = ["searchbar.js"];
          var mysql = req.app.get('mysql');
          res.render('search', context);
          
		
	});


	// render search page after user wants to show ingredients
     router.get('/recipe/ingredients/:id', function (req, res) {

          var callbackCount = 0;
          var context = {};
          context.jsscripts = ["searchbar.js"];
          var mysql = req.app.get('mysql');
          recipe_show_ingredients(req, res, mysql, context, complete);
          function complete() {
               callbackCount++;
               if (callbackCount >= 1) {
                    return res.send(context);
               }

          }
          
			
	});

	// Route Handler -- Handles the search function for food in UpdateIngredients page
	router.get('/updateIngredients/food/:id/:user_search_text?', function(req,res){
          var context = {};
          context.jsscripts = ["searchbar.js"];
          var mysql = req.app.get('mysql');
          updateIngredientsSearch(req, res, mysql, context);
          

	});

	// Handles the update Ingredient button. Router handler to go to the update ingredients page for the user to update a recipe
     router.get('/updateIngredients/:id', function (req, res) {
          var callbackCount = 0;
          var context = {};
          context.jsscripts = ["searchbar.js"];
          var mysql = req.app.get('mysql');
          buildRecipe(req, res, mysql, context, complete);
          recipe_show_ingredients(req, res, mysql, context, complete);
          function complete() {
               callbackCount++;
               if (callbackCount >= 2) {
                    console.log("Update Ingredients Context\n", context);
                    res.render('updateIngredients', context);
               }

          }
          
		
		
		
	});



	// render search page after user seraches
     router.get('/:type/:food_or_recipe_name?', function (req, res) {

          var callbackCount = 0;
          var context = {};
          context.jsscripts = ["searchbar.js"];
          var mysql = req.app.get('mysql');
          var session = req.app.get('session');
          searchInput(req, res, mysql, session, context, complete);
          function complete() {
               callbackCount++;
               if (callbackCount >= 1) {
                    res.render('search', context);
               }

          }
          				
	});


	// Add a food to our foods table in our DB
     router.post('/food', function (req, res) {

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

          console.log("Add Food Data");
          console.log(req.body);
          console.log('\n');

          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(JSON.stringify(error));
                    res.write(JSON.stringify(error));
                    res.end();
               } else {
                    res.status(200);
                    res.end();
               }
          });
          
		
	});

	// Add a recipe to our recipes table in our DB
     router.post('/recipe', function (req, res) {
          var mysql = req.app.get('mysql');
          var sql = "INSERT INTO recipes (recipe_name, recipe_no_meat, recipe_no_dairy, recipe_no_nuts, recipe_no_shellfish, recipe_no_carbs, recipe_no_animal_products, recipe_no_gluten, recipe_no_soy) VALUES (?,?,?,?,?,?,?,?,?)";
          var inserts = [req.body.add_recipe_name,
          req.body.add_recipe_meat,
          req.body.add_recipe_dairy,
          req.body.add_recipe_nuts,
          req.body.add_recipe_shellfish,
          req.body.add_recipe_carbs,
          req.body.add_recipe_animal,
          req.body.add_recipe_gluten,
          req.body.add_recipe_soy];

          console.log("Add Recipe Data");
          console.log(req.body);
          console.log('\n');

          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(JSON.stringify(error));
                    res.write(JSON.stringify(error));
                    res.end();
               } else {
                    res.status(200);
                    res.end();
               }
          });

          
		
	});

	// UPDATE OUR RECIPES in OUR DB
     router.put('/update_recipe/:id', function (req, res) {

          var mysql = req.app.get('mysql');

          console.log("Update Recipe Data");
          console.log(req.body);
          console.log(req.params.id);
          console.log('\n');

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
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(error);
                    res.write(JSON.stringify(error));
                    res.end();
               } else {
                    res.status(200);
                    res.end();
               }
          });

          
		
     });	

	// associate a food with a recipe
     router.post('/updateIngredients/:food_id/:recipe_id', function (req, res) {

          var mysql = req.app.get('mysql');

          var sql = "INSERT INTO foods_recipes (food, recipe) VALUES (?,?)";
          var inserts = [req.params.food_id, req.params.recipe_id];
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(error);
                    res.write(JSON.stringify(error));
                    res.end();
               } else {
                    res.status(200);
                    res.end();
               }
          });

          
		


	});

	// add recipe to user's recipes
     router.post('/recipe/:recipe_id', function (req, res) {

          var mysql = req.app.get('mysql');
          var session = req.app.get('session');

          var sql = "INSERT INTO users_recipes (user, recipe) VALUES (?,?)";
          var inserts = [req.session.user_id, req.params.recipe_id];
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(error);
                    res.write(JSON.stringify(error));
                    res.end();
               }
               else {
                    res.status(200);
                    res.end();
               }
          });

          

	});

     // Handles all delete requests from user on the search page and updateIngredients page
     router.delete('/delete/:type/:id/:id2?', function (req, res) {

          var mysql = req.app.get('mysql');

          var inserts;
          var sql;
          if (req.params.type === "recipe") {
               sql = "DELETE FROM recipes WHERE recipe_id = ?";
               inserts = [req.params.id];
          }
          else if (req.params.type === "food") {
               sql = "DELETE FROM foods WHERE food_id = ?";
               inserts = [req.params.id];
          }
          else if (req.params.type === "ingredients") {
               sql = "DELETE FROM foods_recipes WHERE food = ? AND recipe = ?";
               inserts = [req.params.id, req.params.id2];
          }


          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
               if (error) {
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.status(400);
                    res.end();
               }
               else {
                    res.status(202).end();
               }
          })

          

     });
	
	return router;
}();
