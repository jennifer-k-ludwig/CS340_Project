//User Page get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
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
		
	function updateDiet(res, req, mysql, complete) {
			mysql.pool.query('UPDATE diets SET diet_no_meat=?,diet_no_dairy=?,diet_no_nuts=?,diet_no_shellfish=?,diet_no_carbs=?,diet_no_animal_products-=?,diet_no_gluten=?,diet_no_soy=? WHERE diets.diet_id=?', 
			[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy,req.session.diet_id], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				complete();
			});
	}
	
	function updateUser(res, req, mysql, complete) {		
			mysql.pool.query('UPDATE users SET first_name=?,last_name=?,birth_date=?,email_address=?,password=?,max_calories=?,diet=? WHERE users.user_id=?', 
			[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,req.session.diet_id,req.session.user_id], function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}	
				complete();
			});
	}
		
	router.get('/', function(req,res){
		
		res.render('user');
		
	});

	router.post('/', function(req,res){
		
		var callbackCount = 0;
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');
		
		if (req.body.update) {
			convertDiet(req);
			
			//still working on this
		}
			
		if (req.body.delete) {
			deleteUser(res,req,mysql);
		}	
	});
	
	return router;
}();