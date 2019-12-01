//New user Page get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	//getDiet - Selects diet from database based on form data. If diet does not exist, adds it to database. Updates session diet id.
	function getDiet(res, req, mysql, session){
		
		console.log("Inside getDiet");
		
		var getUserNotCalled = true;
		
        mysql.pool.query("SELECT diet_id FROM diets WHERE diet_no_meat=? AND diet_no_dairy=? AND diet_no_nuts=? AND diet_no_shellfish=? AND diet_no_carbs=? AND diet_no_animal_products=? AND diet_no_gluten=? AND diet_no_soy=?", 
		[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			
			else if (results === undefined || results.length == 0) {
				insertDiet(res, req, mysql, session);
				getDiet(res, req, mysql, session);
			}		
			
			else {
				console.log("Diet Id Results");
				console.log(results);
				console.log('\n');
				
				req.session.diet_id = results[0].diet_id;
				console.log("Session diet_id");
				console.log(req.session.diet_id);
				console.log('\n');
	
				if(getUserNotCalled) {
					getUser(res, req, mysql, session);
					getUserNotCalled = false;
				}
			}
		});
	};
	
	//convertDiet - Converts form data values to 1 or 0. 1 if value="1" or 0 if value is undefined.
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
	
	//getUser - Selects user id from database based on the inputted email address and password. If user does not exists, adds them to the database. Sets session user id.
	//NEED TO HANDLE CASES WHERE USER ALREADY EXISTS
	function getUser(res, req, mysql, session) {
		
		//console.log("Inside getUser");
		
		mysql.pool.query("SELECT user_id FROM users WHERE email_address=?", 
		[req.body.email_address], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			else if (results === undefined || results.length == 0) {
				insertUser(res, req, mysql, session);
				getUser(res, req, mysql, session);
			}		
			
			else {
				//console.log("User Id Results");
				//console.log(results);
				//console.log('\n');
				
				req.session.user_id = results[0].user_id;
				//console.log("Session user_id");
				//console.log(req.session.user_id);
				//console.log('\n');
				
				res.redirect('/home');
			}			
		});
	}	
	
	//insertDiet - Inserts diet into dieats table based on form data.
	function insertDiet(res, req, mysql, session) {
			//console.log("Inside insertDiet");
			mysql.pool.query('INSERT INTO `diets` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
			[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
			});
	}
	
	//insertUser - Inserts user info based on form data and the session diet id.
	function insertUser(res, req, mysql, session) {		
			console.log("Inside insertUser");
			mysql.pool.query('INSERT INTO `users` (`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) VALUES (?,?,?,?,?,?,?)', 
			[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,req.session.diet_id], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}	
			});
	}
		
	router.get('/', function(req,res,next){
		
		res.render('new_user');
		
	});

	router.post('/', function(req,res,next){
		
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');

		convertDiet(req);
		console.log("Request Body:");
		console.log(req.body);
		
		getDiet(res, req, mysql, session);			
	});
	
	return router;
}();