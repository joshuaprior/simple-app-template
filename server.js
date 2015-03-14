var express = require('express');
var bodyParser = require('body-parser');

var options = {
    port: 8080,
    restPath: 'rest',
    appPath: {
        logical: 'app',  // path in the URL
        physical: 'app'  // path on disk
    }
};





/* Set up the app
 * * * * * * * * */
var app = express();

// serve static files from the app directory
app.use('/' + options.appPath.logical, express.static(options.appPath.physical));

// parse the json body of rest requests
app.use('/' + options.restPath, bodyParser.json());





/* Set up some rest end points
 * * * * * * * * * * * * * * */

// blanket response for a resource
app.route('/rest/hello')
    .all(function(req, res, next){
        res.json({
            msg: 'Hello world!'
        });
    });

// exmaple implementing verbs for a resource
// with jquery-ajax-json.js you can do something like this:
//      $.ajax.json('put', '/rest/echo/thing1', {query1: 'abc', query2: '123'}, {
//          id: someResourceID
//          someResourceAttribute: 'a resource value'
//      });
app.route('/rest/echo/:id')
    .get(function(req, res, next){
        res.json({
            verb: 'get',
            query: req.query,
            urlEncoded: req.params,
            payload: req.body
        });
    })
    .put(function(req, res, next){
        res.json({
            verb: 'put',
            query: req.query,
            urlEncoded: req.params,
            payload: req.body
        });
    })
    .post(function(req, res, next){
        res.json({
            verb: 'post',
            query: req.query,
            urlEncoded: req.params,
            payload: req.body
        });
    })
    .delete(function(req, res, next){
        res.json({
            verb: 'delete',
            query: req.query,
            urlEncoded: req.params,
            payload: req.body
        });
    });





var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/sql_database.dat', function(err){
    if(err) throw err;
    
    db.serialize(function() {
        /*db.run('DROP TABLE lorem');
        db.run("CREATE TABLE lorem (info TEXT)");

        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();
        */

        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
    });

    db.close();
});
 






/* finished starting the server
 * * * * * * * * * * * * * * * */
app.listen(options.port);
console.log('[Server] Ready.');
console.log('[Server] http://[host]:%d/%s', options.port, options.appPath.logical);