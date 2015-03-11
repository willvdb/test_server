exports.run = function(port, root) {

  var fs = require('fs');
  var http = require('http');
  var url = require('url');
  var readline = require('readline');
  var mongo = require('mongodb');
  var ROOT_DIR = root;

  function isEmpty(str) {
    return (!str || 0 === str.length);
  }


  http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true, false);
    console.log(urlObj.pathname.substring(1, 8));
    if (urlObj.pathname.substring(1, 8) === "getcity") {
      fs.readFile("cities.dat.txt", function(err, data) {
        if (err) {
          res.writeHead(200);
          res.end("There was an error getting your cities...")
        } else {
          var resultArray = [];
          if (!isEmpty(urlObj.query["q"])) {
            var cities = data.toString().split('\n');
            var myRe = new RegExp("^" + urlObj.query["q"]);
            for (i = 0; i < cities.length; i++) {
              var result = cities[i].search(myRe);
              if (result != -1) {
                var obj = {
                  "city": cities[i]
                }
                resultArray.push(obj);
              }
            }
          }
          res.writeHead(200);
          res.end(JSON.stringify(resultArray));
        }
      });
    } else if (urlObj.pathname === "/comment") {
      if (req.method === "POST") {
        var jsonData = "";
        req.on('data', function(chunk) {
          jsonData += chunk;
        });
        req.on('end', function() {
          var reqObj = JSON.parse(jsonData);
          var mongo_client = mongo.MongoClient;
          mongo_client.connect("mongodb://localhost/weather", function(err, db) {
            if (err) {
              console.log("error");
            } else {
              db.collection('comments').insert(reqObj, function(err, records) {
                res.writeHead(200);
                res.end("");
              });
            }
          });
        });
      } else if (req.method === "GET"){
        var mongo_client = mongo.MongoClient;
        mongo_client.connect("mongodb://localhost/weather", function(err, db){
          if (err) {
            console.log("error");
          } else {
            comments.find(function(err, items){
              items.toArray(function(err, item_array){
                res.writeHead(200);
                res.end(JSON.stringify(item_array));
              });
            });
          }
        });
      }

    } else if (urlObj.pathname === "/") {
      fs.readFile("prod/vdbMovies/vdm.htm", function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    } else if (urlObj.pathname === "/weather") {
      fs.readFile("prod/vdbMovies/city-weather.html", function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    } else {
      fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    }
  }).listen(port);
}

var port = process.argv[2];
var root = process.argv[3];

exports.run(port, root);
