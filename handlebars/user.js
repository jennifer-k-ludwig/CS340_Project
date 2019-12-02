//User Page get and post requests
module.exports = function(){
    var express = require('express');
     var router = express.Router();

     // Helper function to make the user login if they haven't already
     function forceLogin(req) {
          console.log("session ID", req.session.user_id);
          return req.session.user_id === undefined;

     }

	//deleteUser - Deletes user from database, destroys the session, and redirects to login page.
	function deleteUser (res,req,mysql) {
			mysql.pool.query('DELETE FROM users WHERE user_id=?', 
			[req.session.user_id], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				req.session.destroy();
				res.redirect('/login');
			});
	}
	
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
	
	//updateDiet - Selects existing diet based on form data. If diet does not exist, creates new diet, otherwise sets session id and updates user info.
	function updateDiet(res, req, mysql, session, current) {
		
		//console.log("Inside updateDiet");
		
		var updateUserNotCalled = true;
		
        mysql.pool.query("SELECT diet_id FROM diets WHERE diet_no_meat=? AND diet_no_dairy=? AND diet_no_nuts=? AND diet_no_shellfish=? AND diet_no_carbs=? AND diet_no_animal_products=? AND diet_no_gluten=? AND diet_no_soy=?", 
		[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
			}
			
			else if (results === undefined || results.length == 0) {
				insertDiet(res, req, mysql, session);
				updateDiet(res, req, mysql, session);
			}		
			
			else {
				console.log("Diet Id Results");
				console.log(results);
				console.log('\n');
				
				req.session.diet_id = results[0].diet_id;
				console.log("Session diet_id");
				console.log(req.session.diet_id);
				console.log('\n');
	
				if(updateUserNotCalled) {
					updateUser(res, req, mysql, session, current);
					updateUserNotCalled = false;
					res.redirect('/home');
				}
			}
		});
	}
	
	//insertDiet - Inserts diet into diets table based on form data.
	function insertDiet(res, req, mysql, session) {
			console.log("Inside insertDiet");
			mysql.pool.query('INSERT INTO `diets` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
			[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
			});
	}
	
	//updateUser - Updates user info in users table based on form data.
	function updateUser(res, req, mysql, session, current) {	

			mysql.pool.query('UPDATE users SET first_name=?,last_name=?,birth_date=?,email_address=?,password=?,max_calories=?,diet=? WHERE users.user_id=?', 
				[req.body.first_name || current.first_name,req.body.last_name || current.last_name,req.body.birth_date || current.birth_date,req.body.email_address || current.email_address,req.body.password || current.password,req.body.max_calories || current.max_calories,req.session.diet_id,req.session.user_id], function(error, results, fields){
					if(error){
						res.write(JSON.stringify(error));
						res.end();
					}	
				});
	}
	
	//currentUserGET - Gets the current user info.
	function currentUserGET(res, req, mysql, session, complete, context, current) {
		mysql.pool.query('SELECT * FROM users INNER JOIN diets on diet=diet_id WHERE user_id=?', 
		[req.session.user_id], function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			
			current = results[0];
			console.log("Current:");
			console.log(current);
			complete(res,req,context,current);
		});
	}
	
	//currentUserGET - Gets the current user info and updates it with new info.
	function currentUserPOST(res, req, mysql, session, current) {
		mysql.pool.query('SELECT * FROM users INNER JOIN diets on diet=diet_id WHERE user_id=?', 
		[req.session.user_id], function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			
			current = results[0];
			console.log("Current:");
			console.log(current);
			
			updateDiet(res, req, mysql, session, current);
		});
	}
	
	router.get('/', function(req,res){
          // if the user has not logged in, make them do so
          if (forceLogin(req)) {
               res.redirect('/login');
          }

          else {
               var callbackCount = 0;
               var mysql = req.app.get('mysql');
               var session = req.app.get('session');
               var context = {};
               var current;

               currentUserGET(res, req, mysql, session, complete, context, current);

               function complete(res, req, context, current) {
                    callbackCount++;
                    if (callbackCount >= 1) {
                         context.first_name = current.first_name;
                         context.last_name = current.last_name;
                         context.birth_date = current.birth_date;
                         context.max_calories = current.max_calories;
                         context.email_address = current.email_address;
                         context.password = current.password;
                         context.no_meat_checked = false;
                         res.render('user', context);
                    }
               }

          }
		
	});

	router.post('/', function(req,res){

          var mysql = req.app.get('mysql');
          var session = req.app.get('session');
          var current;

          if (req.body.update) {
               convertDiet(req);
               currentUserPOST(res, req, mysql, session, current);
          }

          if (req.body.delete) {
               deleteUser(res, req, mysql);
          }	

          

	});
	
	return router;
}();