

var express = require('express'); 
var app = express();   
var path = require('path');
var server = app.listen(process.env.PORT || 5000,function(){

  console.log("Express server listening in %s mode", process.env.PORT, app.settings.env);
});

var io = require('socket.io').listen(server);
 
//Database - mongodb
var mongodb = require("mongodb");



queues_holder = [];
socket_list = {};

//Routing
app.set("view engine","ejs");

//Respond to get req
var path = require('path');
 
 



app.get("/", function(req,res){
	console.log("Requested Homepage")
	var MongoClient = mongodb.MongoClient;
	var mongoUrl = "mongodb://127.0.0.1:27017/debatable";

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
			  res.render("index",{'topic_list':result});
			}else{
				console.log("No data found in collection");
				 res.render("index",{'topic_list':result});
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



function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



function join_debate(socket,debate_name){    
    console.log("Joined the debate " + debate_name);
    if (queues_holder[debate_name] == undefined){
    	queues_holder[debate_name] = [];
    } 
    queues_holder[debate_name][socket.id] = socket.id;
    console.log("===== " , queues_holder)
}


function spectate_debate(socket,debate_name){    
    console.log("Spectating the debate " + debate_name);
    
}


function join_debate_queue(socket,debate_name){
	//queues_holder["trump"] = ["123","666","987"]; 
	if (!queues_holder[debate_name]){
		queues_holder[debate_name] = [];
	}
	//queues_holder.trump.push("hello")
	queues_holder[debate_name].push(socket.id) //add socket id to list
	console.log("User has joined debate queue ====== " + queues_holder[debate_name].length);

	check_debate_queue(debate_name);
};


function check_debate_queue(debate_name){
	if (queues_holder[debate_name].length >= 2){
		 create_debate_room(debate_name);
	}else{
		console.log("Not enough people in the " + debate_name + " queue to start a debate.")
	}
};


 
function create_debate_room(debate_name){
	room_id = randomString(16);
	console.log("New room created ", room_id);
	//debate_queue.trump[0]
	for (i = 0; i <= 1; i++) {//get sockets of first 2 people in queue 
		console.log("======= + " + socket_list[0] + " + =======" )
    	current_socket_id = queues_holder[debate_name][i];
    	current_socket = socket_list[current_socket_id]; 
    	current_socket.join(room_id);
    	console.log("User joined a new room")
    	room_data = {'debate_name':debate_name,'room_id':room_id};
    	current_socket.emit("joined_room",room_data);
   	}
	//Remove these users from the queue
 	
 	queues_holder[debate_name].splice(0, 2);//remove the two 
	console.log(queues_holder[debate_name].length + " ======= ")



}



//Socket.io connection
io.on('connection', function(socket){
  console.log('a user connected ' +  socket.id);
  //Add to socket list
  socket_list[socket.id] = socket;

  socket.on("join_debate", function(debate_name){
  	console.log("User wanting to join debate: " , debate_name);
  	//Make this a queue script:  
  	//User reachers top of queue!!!=========
  	//create_room(socket, debate_name);//Create a room and send them to it
  	//join_debate(socket,debate_name);
  	//Join debate queue

  	join_debate_queue(socket, debate_name);

  }); 


  socket.on("spectate_debate", function(debate_name){
  	console.log("User wanting to spectate debate: " , debate_name);
  	//Make this a queue script:  
  });




   socket.on('chat message', function(msg){  
    io.in(msg.room_id).emit('new message', msg.message);
 

  });




});