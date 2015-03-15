var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var knex = require('knex');

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





/* Here is how to set up a basic relational database.
 * Documentation:
 *      Knex.js: http://knexjs.org/
 *      node-sqlite3: https://github.com/mapbox/node-sqlite3/wiki
 *      SQLite: https://sqlite.org
 *          SQL Syntax: https://sqlite.org/lang.html
 *          Datatypes: https://sqlite.org/datatype3.html
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
var db = knex({
    dialect: 'sqlite3',
    connection: {
        filename: 'data/sql_database.dat'
    }
});

db.schema
    // clean the demo database
    .dropTableIfExists('tracks')
    .dropTableIfExists('artists')

    // create the tables
    .createTable('artists', function(table){
        table.increments('id');
        table.text('name');
    })
    .createTable('tracks', function(table){
        table.increments('id');
        table.integer('artist_id').notNullable().references('artists.id');
        table.text('name');
        table.integer('playtime');
    })
    
    // Metalica
    .then(function(){
        return db('artists').insert({name:'Metalica'});
    })
    .then(function(id){
        id = id[0];
        return db('tracks').insert([
            {artist_id: id, name: 'Fade to Black'},
            {artist_id: id, name: "It's Electric"},
            {artist_id: id, name: 'Sabbra Cadabra'},
            {artist_id: id, name: 'Whiskey in the Jar'},
        ]);
    })
    
    // Michael Jackson
    .then(function(){
        return db('artists').insert({name: 'Michael Jackson'});
    })
    .then(function(id){
        id = id[0];
        return db('tracks').insert([
            {artist_id: id, name: 'Billie Jean'},
            {artist_id: id, name: 'Thriller'},
            {artist_id: id, name: 'Beat It'},
            {artist_id: id, name: 'Man in the Mirror'},
        ]);
    })
    
    // query the data that was just inserted
    .then(function(){
        return db('artists')
            .join('tracks', 'artists.id', 'tracks.artist_id')
            .select('artists.name as artist', 'tracks.name as track');
    })
    
    .then(function(){
        return db('tracks')
            .select('artists.name as artist')
            .join('artists', 'artists.id', 'tracks.id')
            .where();
    })
    
    // hook into the map function so we can print out the results
    .map(function(row) {
        console.log(row);
    })
    .catch(function(e) {
        console.error(e);
    })
    .then(function(){
        db.destroy();
    });
 



/* finished starting the server
 * * * * * * * * * * * * * * * */
app.listen(options.port);
console.log('[Server] Ready.');
console.log('[Server] http://[host]:%d/%s', options.port, options.appPath.logical);