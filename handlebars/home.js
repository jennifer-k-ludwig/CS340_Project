module.exports = function() {

	var express = require('express');
    var router = express.Router();

	function getName(res, req, mysql, session, context, complete){
        mysql.pool.query("SELECT first_name FROM users WHERE user_id=?", [req.session.user_id], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			console.log("User First Name");
			console.log(results);
			console.log('\n');

            context.first_name = results[0].first_name;
            complete();
		});
	}

	// query to get Diets -- we'll need to change the query to only select user diets
	function getDiet(res, req, mysql, session, context, complete){
        mysql.pool.query("SELECT diet_no_meat,diet_no_dairy,diet_no_nuts,diet_no_shellfish,diet_no_carbs,diet_no_animal_products,diet_no_gluten,diet_no_soy FROM diets INNER JOIN users ON users.diet=diets.diet_id WHERE user_id=?", [req.session.user_id], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			console.log("Diets Results");
			console.log(results);
			console.log('\n');

			parseDietResults(results);

            context.diet = results;
            complete();
		});
	}
	
	// query to get RECIPES -- we'll need to change the query to only select user recipes
	function getRecipes(res, req, mysql, session, context, complete){
        mysql.pool.query("SELECT recipes.recipe_name FROM recipes INNER JOIN users_recipes ON recipes.recipe_id = users_recipes.recipe INNER JOIN users ON users_recipes.user = users.user_id WHERE user_id=?", [req.session.user_id], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			console.log("Recipes Results");
			console.log(results);
			console.log('\n');

            context.recipes  = results;
            complete();
        });
	}
	

	// helper function to change the 1's and 0's of the diet query to Yes and No.
	function parseDietResults(results) {
		results.forEach(element => {
			if (element.diet_no_meat === 1) element.diet_no_meat = "Yes";
			else element.diet_no_meat = "No";

			if (element.diet_no_dairy === 1) element.diet_no_dairy = "Yes";
			else element.diet_no_dairy = "No";

			if (element.diet_no_nuts === 1) element.diet_no_nuts = "Yes";
			else element.diet_no_nuts = "No";

			if (element.diet_no_shellfish === 1) element.diet_no_shellfish = "Yes";
			else element.diet_no_shellfish = "No";

			if (element.diet_no_carbs === 1) element.diet_no_carbs = "Yes";
			else element.diet_no_carbs = "No";

			if (element.diet_no_animal_products === 1) element.diet_no_animal_products = "Yes";
			else element.diet_no_animal_products = "No";

			if (element.diet_no_gluten === 1) element.diet_no_gluten = "Yes";
			else element.diet_no_gluten = "No";

			if (element.diet_no_soy === 1) element.diet_no_soy = "Yes";
			else element.diet_no_soy = "No";
		});
	}
	
	//Home Page get and post requests
	router.get('/', function(req,res){
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');

		getName(res,req,mysql,session,context,complete);
		getRecipes(res,req,mysql,session,context,complete);
		getDiet(res,req,mysql,session,context,complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 3){
				res.render('home', context);
			}
		}
	});
		
	router.post('/', function(req,res) {
		if(req.body.log_out) {
			req.session.destroy();
			res.redirect('/login');
		}    
	});
	
	return router;
}();