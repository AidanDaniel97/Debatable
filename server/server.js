var express = require('express'); 
var app = express();   
var path = require('path');
var server = app.listen(process.env.PORT || 5000,function(){

  console.log("Express server listening in %s mode", process.env.PORT, app.settings.env);
});
var io = require('socket.io').listen(server);


//Database - mongodb
var mongodb = require("mongodb"); 
app.use(express.static(path.join(__dirname, '../client')));



socket_list = {};
queues_holder = [];

var queue_manager = require("../server/modules/queue_manager");

//Routing
app.set("view engine","ejs");

//Respond to get req
var path = require('path');
 
function get_date(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 
	var today = dd+'/'+mm+'/'+yyyy;
	return today;
}



app.get("/", function(req,res){
	console.log("Requested Homepage")
	var MongoClient = mongodb.MongoClient;
	var mongoUrl = "mongodb://127.0.0.1:27017/debatable";
	var server_date = get_date();


MongoClient.connect(mongoUrl,function(err,db){
	if(err){
		console.log("Unable to connect to MongoDB " , err)
	}else{
		console.log("Connection establish with MongoDB")
	
		var topics = db.collection("topics");

		topics.find().toArray(function(err,result){ 
			if (err){
				console.log("Error retrieving database collection");
			}else if (result){  
				res.render("index",{'topic_list':result,'current_date':server_date});
			}else{
				console.log("No data found in collection");
				res.render("index",{'topic_list':result,'current_date':server_date});
			}

			db.close();
		});

		
	}


})

});


 

app.get("/chat/:debate_name/:debate_mode", function(req,res){
	//get debate information from databse here
	res.render("chat", {debate_name: req.params.debate_name, debate_mode:req.params.debate_mode}) //Load the view chat 
});



function spectate_debate(socket,debate_name){    
    console.log("Spectating the debate " + debate_name);
    
}







//Socket.io connection
io.on('connection', function(socket){
  console.log('a user connected ' +  socket.id);
  //Add to socket list
  socket_list[socket.id] = socket;

  socket.on("join_debate", function(debate_info){
  	var debate_name = debate_info.debate_name;
  	var debate_side = debate_info.debate_side; 
  	console.log("User wanting to join debate: " , debate_name);
  	//Make this a queue script:  
  	//User reachers top of queue!!!=========
  	//create_room(socket, debate_name);//Create a room and send them to it
  	//join_debate(socket,debate_name);
  	//Join debate queue

  	queue_manager.join_debate_queue(socket, debate_name, debate_side);

  }); 


  socket.on("spectate_debate", function(debate_name){
  	console.log("User wanting to spectate debate: " , debate_name);
  	//Make this a queue script:  
  });




   socket.on('chat message', function(msg){  
    io.in(msg.room_id).emit('new message', msg.message);
 

  });




});