var express = require('express')
var app = express(); 

var server = app.listen(process.env.PORT || 5000,function(){
	console.log("Debatable V0.0.1");
});


var path = require('path');
 
      
 
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function(req, res){
    res.render('index.html');  
}); 

 
 

