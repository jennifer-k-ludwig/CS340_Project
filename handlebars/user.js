//User Page get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
	router.get('/', function(req,res,next){
		
		res.render('user');
		
	});

	router.post('/', function(req,res,next){
		
		//Inserts user entered values into the diets table
		/*mysql.pool.query('INSERT INTO `diet` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
		[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], 
			function(err, result){
				if(err){
					next(err);
					return;
				}
		});	
		*/
		//Inserts user info into the user table
		mysql.pool.query('INSERT INTO `users` (`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) VALUES (?,?,?,?,?,?,?)', 
		[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,1], 
			function(err, results){
				if(err){
					next(err);
					return;
				}
		});	
		
	});
	
	return router;
}();