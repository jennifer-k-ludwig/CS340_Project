module.exports = function() {

	var express = require('express');
    var router = express.Router();

	
	function searchInput(req, res, mysql, context, complete){
		var user_search = req.params.s;
		if (user_search.substring(0,4) === "food")
		{
			user_search = user_search.substring(4);
			var query = "SELECT * FROM foods WHERE foods.food_name LIKE " + mysql.pool.escape(user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Food Results");
				console.log(results);
				console.log('\n');
				
				context.display_food = true;
				context.food = results;
				complete("food");
	
			});
		}
		else if (user_search.substring(0,6) === "recipe")
		{
			user_search = user_search.substring(6);
			var query = "SELECT * FROM recipes WHERE recipes.recipe_name LIKE " + mysql.pool.escape(user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Recipe Results");
				console.log(results);
				console.log('\n');
			
				context.display_recipe = true;
				context.recipe = results;
				complete("recipe");
	
			});
		}

	}
	
	

	
	
	router.get('/', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
	

		res.render('search', context);

        
		
	});

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