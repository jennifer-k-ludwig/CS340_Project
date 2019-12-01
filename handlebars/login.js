//Login Page - get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();

	router.get('/', function(req,res){
		
		res.render('login');
		
	});

	router.post('/', function(req,res){
		
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');
		
		mysql.pool.query('SELECT user_id, diet_id FROM users INNER JOIN diets ON diet=diet_id WHERE email_address=? AND password=?', [req.body.email_address, req.body.password], 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				else{
					req.session.user_id = results[0].user_id;
					req.session.diet_id = results[0].diet_id;
					res.redirect('/home');
				}
		});
	});
	
	return router;
}();