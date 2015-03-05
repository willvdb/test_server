exports.run = function(port, root){

  var fs = require('fs');
  var http = require('http');
  var url = require('url');
  var ROOT_DIR = root;
  function isEmpty(str) {
    return (!str || 0 === str.length);
  }


  http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    if (urlObj.pathname.indexOf("getcity") !== -1){
      fs.readFile("cities.dat.txt", function(err, data){
        if(err){
          res.writeHead(200);
          res.end("There was an error getting your cities...")
        } else {
          var resultArray = [];
          if (!isEmpty(urlObj.query["q"])){
            var cities = data.toString().split('\n');
            var myRe = new RegExp("^"+urlObj.query["q"]);
            for (i = 0; i < cities.length; i++){
              var result = cities[i].search(myRe);
              if(result != -1) {
                var obj = {"city": cities[i]}
                resultArray.push(obj);
              }
            }
          }
          res.writeHead(200);
          res.end(JSON.stringify(resultArray));
        }
      });
    } else if(urlObj.pathname === "/"){
      fs.readFile("prod/vdbMovies/vdm.htm", function (err,data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    } else if(urlObj.pathname === "/weather"){
      fs.readFile("prod/vdbMovies/city-weather.html", function (err,data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    } else {
      fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
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
