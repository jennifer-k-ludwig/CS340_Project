module.exports = function() {

	var express = require('express');
    var router = express.Router();


	// query to get Diets -- we'll need to change the query to only select user diets
	function getDiet(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM diets", function(error, results, fields){
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
	function getRecipes(res, mysql, context, complete){
        mysql.pool.query("SELECT recipe_id, recipe_name FROM recipes", function(error, results, fields){
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

		getRecipes(res,mysql, context, complete);
		getDiet(res,mysql,context,complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('home', context);
			}

		}
        
		
	});
	return router;
}();