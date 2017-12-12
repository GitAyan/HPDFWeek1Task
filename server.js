var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var http=require('http');
var request = require('request');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

//This will deny data with Forbidden status code
app.get('/robots.txt',function(req,res){
  res.status(403).send("Denied");
});

//Set Cookie Value
app.get('/setcookie',function(req,res){
  var cookie=req.cookies.CookieMonster;
  if(cookie===undefined){
    let values={
      name:'Ayan Choudhury',
      age:20
      }
    res.cookie('CookieMonster',JSON.stringify(values));
    res.send('Cookie Set.');
    console.log('Cookie Created.');
  }
  else{
    res.send('Cookie already exists.');
    console.log('Cookie already exists.')
  }
});

//Get Cookies value
app.get('/getcookies',function(req,res){
  var cookie=req.cookies;
  var output="";
  for(var item in cookie){
    output+="Cookie \'"+item+"\' has the values "+cookie[item]+"<br>";
    var s=JSON.parse(cookie[item]);
    for(var i in s){
      output+="The attribute key \'"+i+"\' has the value \'"+s[i]+"\'<br>";
    }
  }
  res.send(output.toString());
  console.log(cookie);
});

//Display Hello World with user's name
app.get('/',function(req,res){
  res.send("Hello World - Ayan");
});

//send an image
app.get('/image',function(req,res){
  res.sendFile(path.join(__dirname,'ui','sgdoubleneck.jpg'));
});

//This will fetch a list of authors and their post counts
//from the endpoints at jsonplaceholder.typicode.com
app.get('/authors',function(req,res){
function users(callback){
  var r= request('http://jsonplaceholder.typicode.com/users', function (error, response, body) {
    if(!error && response.statusCode == 200){
      return callback(body);
      r.abort();
    }
    else{
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      r.abort();
    }
  });
}

function posts(callback){
var r2=request('http://jsonplaceholder.typicode.com/posts', function (error, response, body) {
  if(!error && response.statusCode == 200){
    return callback(body);
    r2.abort();
  }
  else{
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    postsarray=null;
    r2.abort();
  }
});
}

users(function(response){
  var usersarray=JSON.parse(response);
  var postsarray;
  posts(function(data){
  postsarray=JSON.parse(data);
  var countsjson={};
  for(var i=0; i<usersarray.length; i++){
    var jsonobj=usersarray[i];
    countsjson[jsonobj['id']]={"name":jsonobj['name'],"count":0};
  }
   for(var i=0;i<postsarray.length; i++){
     var jsonobj=postsarray[i];
     var userid=jsonobj['userId'];
     countsjson[userid].count+=1;
   }
  console.log(countsjson);
  var output="<table><th>Name</th><th>Count</th>";
  for(var i in countsjson){
  output+="<tr><td>"+JSON.stringify(countsjson[i].name).split('\"')[1]+"</td><td>"+JSON.stringify(countsjson[i].count)+"</td></tr>";
  }
  res.send(output+"</table>");
  });
});
});

//This will contain a TextBox where you can write the name to receive
app.get('/input', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui','index.html'));
});

//This will send data received via Post to console and also alert browser
app.post('/inputlog', function (req, res) {
   var username = req.body.name;
   console.log(username.toString() + ' received via POST.');
   res.send(username.toString()+" has been received!");
});

//For sending resources to browser calls
app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

//Listen to port
var port = 8080;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
