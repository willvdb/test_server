var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "prod/vdbMovies";


http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  if (urlObj.pathname.indexOf("getcity") !== -1){
    fs.readFile("cities.dat.txt", function(err, data){
      if(err){

      } else {
        if (urlObj["q"] !=== ""){
          var cities = data.toString().split('\n');
          var myRe = new RegExp("^"+urlObj.query["q"]);
          var resultArray = [];
          for (i = 0; i < cities.length; i++){
            var result = cities[i].search(myRe);
            if(result != -1) {
              var obj = {"city": cities[i]}
              resultArray.push(obj);
            }
          }
          res.writeHead(200);
          res.end(JSON.stringify(resultArray));
        }
      }
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
}).listen(8080);
