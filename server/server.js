

var express = require('express'); 
var app = express();   
var path = require('path');
var server = app.listen(process.env.PORT || 5000,function(){

  console.log("Express server listening in %s mode", process.env.PORT, app.settings.env);
});

var io = require('socket.io').listen(server);
 


//Routing
app.set("view engine","ejs");

//Respond to get req
var path = require('path');
 
      
 
app.use(express.static(path.join(__dirname, '../client')));

app.get("/", function(req,res){
	res.sendFile("index.html")
});


app.get("/chat/:debate_name/:room_id/:socket_id", function(req,res){
	res.render("chat", {debate_name: req.params.debate_name, room_id: req.params.room_id, socket_id: req.params.socket_id}) //Load the view chat 
});



function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

room_id = randomString(4);

function join_queue(socket,debate_name){
	 // once a client has connected, we expect to get a ping from them saying what room they want to join
    
    console.log("New room created ", room_id)
    socket.join(room_id);
   	//redirect to the chat page  
   	var destination = '/chat/'+debate_name+'/'+room_id+'/'+socket.id;
	socket.emit('redirect', destination);
}

//Socket.io connection
io.on('connection', function(socket){
  console.log('a user connected ' +  socket.id);
  

  socket.on("joinQueue", function(debate_name){
  	console.log("JOINED DEBATE QUEUE FOR: " , debate_name);
  	//Make this a queue script: 
  	join_queue(socket,debate_name);
  	console.log(socket.rooms)
  });

   socket.on('chat message', function(msg){ 
   	console.log(socket.currentRoom)
    io.in(socket.currentRoom).emit('new message', msg);
 

  });




});