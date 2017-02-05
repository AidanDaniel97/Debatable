

var express = require('express'); 
var app = express();   
var path = require('path');
var server = app.listen(process.env.PORT || 5000,function(){

  console.log("Express server listening in %s mode", process.env.PORT, app.settings.env);
});

var io = require('socket.io').listen(server);
 

queues_holder = [];


//Routing
app.set("view engine","ejs");

//Respond to get req
var path = require('path');
 
app.use(express.static(path.join(__dirname, '../client')));

app.get("/", function(req,res){
	res.sendFile("index.html")
});

app.get("/chat/:debate_name/:debate_mode", function(req,res){
	res.render("chat", {debate_name: req.params.debate_name, debate_mode:req.params.debate_mode}) //Load the view chat 
});



function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

 
function create_room(socket,debate_name){
	room_id = randomString(16);
	   console.log("New room created ", room_id)
       socket.join(room_id); 
       console.log("User joined a new room")
       room_data = {'debate_name':debate_name,'room_id':room_id};
       socket.emit("joined_room",room_data)
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




//Socket.io connection
io.on('connection', function(socket){
  console.log('a user connected ' +  socket.id);
  
 var sessionid = io.engine.id;
  console.log("session ID " + sessionid)

  socket.on("join_debate", function(debate_name){
  	console.log("User wanting to join debate: " , debate_name);
  	//Make this a queue script:  
  	//User reachers top of queue!!!=========
  	//create_room(socket, debate_name);//Create a room and send them to it
  	join_debate(socket,debate_name);
  }); 


  socket.on("spectate_debate", function(debate_name){
  	console.log("User wanting to spectate debate: " , debate_name);
  	//Make this a queue script:  
  });




   socket.on('chat message', function(msg){  
    io.in(msg.room_id).emit('new message', msg.message);
 

  });




});