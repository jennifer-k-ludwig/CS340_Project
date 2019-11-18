//Login Page - get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();

	router.get('/', function(req,res){
		
		res.render('login');
		
	});

	router.post('/', function(req,res){
		
		var mysql = req.app.get('mysql');
		req.session.id = mysql.pool.query('SELECT user_id FROM users WHERE email_address=? AND password=?', [req.body.email_address, req.body.password], 
			function(err, results, fields){
				if(err){
					next(err);
					return;
				}
				
			return results;
		});	

	});
	
	return router;
}();