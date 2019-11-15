var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_ludwigje',
  password        : '7296',
  database        : 'cs340_ludwigje'
});

module.exports.pool = pool;
