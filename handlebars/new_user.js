//New user Page get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	function getDiet(res, req, mysql, complete){
		
        mysql.pool.query("SELECT diet_id FROM diets WHERE diet_no_meat=? AND diet_no_dairy=? AND diet_no_nuts=? AND diet_no_shellfish=? AND diet_no_carbs=? AND diet_no_animal_products=? AND diet_no_gluten=? AND diet_no_soy=?", 
		[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			console.log("Diet Id Results");
			console.log(results);
			console.log('\n');
			
			req.session.select_diet = results;
			console.log("Session select_diet");
			console.log(req.session.select_diet);
			console.log('\n');			
			
			complete();

		});
	};
	
	function convertDiet (req) {
		if (req.body.no_meat != 1) req.body.no_meat = 0;

		if (req.body.no_dairy != 1) req.body.no_dairy = 0;
		
		if (req.body.no_nuts != 1) req.body.no_nuts = 0;
		
		if (req.body.no_shellfish != 1) req.body.no_shellfish = 0;

		if (req.body.no_carbs != 1) req.body.no_carbs = 0;

		if (req.body.no_animal_products != 1) req.body.no_animal_products = 0;

		if (req.body.no_gluten != 1) req.body.no_gluten = 0;
		
		if (req.body.no_soy != 1) req.body.no_soy = 0;	
	};
	
	function getUser(res, req, mysql, complete) {
		mysql.pool.query("SELECT user_id FROM users WHERE email_address=?", 
		[req.body.email_address], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			console.log("User Id Results");
			console.log(results);
			console.log('\n');
			
			req.session.select_user = results;
			console.log("Session select_user");
			console.log(req.session.select_user);
			console.log('\n');			
			
			complete();

		});
	}	
	
	function insertDiet(res, req, mysql, complete) {
			console.log("Inside insertDiet");
			mysql.pool.query('INSERT INTO `diets` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
			[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				complete();
			});
	}
	
	function insertUser(res, req, mysql, complete) {		
			console.log("Inside insertUser");
			mysql.pool.query('INSERT INTO `users` (`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) VALUES (?,?,?,?,?,?,?)', 
			[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,req.session.select_diet[0].diet_id], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}	
				complete();
			});
	}
		
	router.get('/', function(req,res,next){
		
		res.render('new_user');
		
	});

	router.post('/', function(req,res,next){
		
		var callbackCount = 0;
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');

		convertDiet(req);
		console.log("Request Body:");
		console.log(req.body);
		
		getDiet(res, req, mysql, complete);
		getUser(res, req, mysql, complete);
		
		function complete(){
			callbackCount++;
		}
	
		if(callbackCount >= 2){
			if(req.session.select_diet === undefined || req.session.select_diet.length == 0) {
				insertDiet(res, req, mysql, complete);
				getDiet(res, req, mysql, complete);
			}
			req.session.diet_id = req.session.select_diet[0].diet_id;
			if(req.session.select_user === undefined || req.session.select_user.length == 0) {
				insertUser(res, req, mysql, complete);
				getUser(res, req, mysql, complete);
			}			
			req.session.user_id = req.session.select_user[0].user_id;
			res.redirect('/home');
		}
	});
	
	return router;
}();