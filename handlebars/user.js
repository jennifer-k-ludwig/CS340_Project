//User Page get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	function getDiet(req, mysql) {
		mysql.pool.query('SELECT diet_id FROM diets WHERE diet_no_meat=? AND diet_no_dairy=? AND diet_no_nuts=? AND diet_no_shellfish=? AND diet_no_carbs=? AND diet_no_animal_products=? AND diet_no_gluten=? AND diet_no_soy=?', 
		[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else{
					return results;
				}
		});		
	}
		
	router.get('/', function(req,res){
		
		res.render('user');
		
	});

	router.post('/', function(req,res){
		
		var mysql = req.app.get('mysql')
		var diet = 1;
		/*
		var diet = getDiet(req,mysql);

		//Inserts user entered values into the diets table
		if(!diet) {
			mysql.pool.query('INSERT INTO `diets` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
			[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], 
				function(error, results, fields){
					if(error){
						res.write(JSON.stringify(error));
						res.end();
					}
			});	
		}
		*/
		
		//Inserts user info into the user table
		mysql.pool.query('INSERT INTO `users` (`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) VALUES (?,?,?,?,?,?,?)', 
		[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,diet], 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else{
					res.redirect('/home');
				}
		});		
	});
	
	return router;
}();