// get the client
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  "host"     : "10.148.10.122",
  "user"     : "insitem",
  "password" : "in%item",
  "database" : "gift",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const promisePool = pool.promise();

// For pool initialization, see above
//pool.query("SELECT field FROM atable", function(err, rows, fields) {
   // Connection is automatically released when query resolves
//})
/**
 *
 */
`INSERT INTO tab_item
  (datetime, code, item, language, content, forecast, crtime)
VALUES
  (${datetime}, "special_edition_description", "East_Typhoon_Info", "CN", "${content}", "typress", NOW())
ON DUPLICATE KEY UPDATE
  title = @title,
  author = @author,
  year_published = @year_published;`;

async function upInsert(content='', type='EN', time='20190603 03:00:00'){
  try{
    const [rows,fields] = await promisePool.query("SELECT * FROM `tab_item` WHERE ");
  }
  catch(err){
    console.error(err);
    throw err;
  }
}
  // now get a Promise wrapped instance of that pool

  // query database using promises

