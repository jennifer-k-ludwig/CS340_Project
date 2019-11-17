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
            context.diet  = results;
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
            context.recipes  = results;
            complete();
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