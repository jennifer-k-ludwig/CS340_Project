module.exports = function() {

	var express = require('express');
    var router = express.Router();

	
	function searchInput(req, res, mysql, context, complete){
		var user_search = req.params.s;
		if (user_search.substring(0,4) === "food")
		{
			user_search = user_search.substring(5);
			var query = "SELECT * FROM foods WHERE foods.food_name LIKE " + mysql.pool.escape(user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Results");
				console.log(results);
				console.log('\n');
	
				context.search = results;
				complete();
	
			});
		}
		else 
		{
			user_search = user_search.substring(7);
			var query = "SELECT * FROM recipes WHERE recipes.recipe_name LIKE " + mysql.pool.escape(user_search + '%');
			mysql.pool.query(query, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				console.log("Search Results");
				console.log(results);
				console.log('\n');
	
				context.search = results;
				complete();
	
			});
		}

	}
	
	

	
	
	router.get('/', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
	

		res.render('search');

        
		
	});

	router.get('/:s', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["searchbar.js"];
		var mysql = req.app.get('mysql');
		searchInput (req, res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('search');
			}

		}
		
	});
	return router;
}();