exports.randomString = function randomString(length) {

    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



exports.join_debate = function join_debate(socket,debate_name){    
    console.log("Joined the debate " + debate_name);
    if (queues_holder[debate_name] == undefined){
    	queues_holder[debate_name] = [];
    } 
    queues_holder[debate_name][socket.id] = socket.id;
    console.log("===== " , queues_holder)
}



exports.join_debate_queue = function join_debate_queue(socket,debate_name,debate_side){
	//queues_holder["trump"] = ["123","666","987"]; 
	if (!queues_holder[debate_name]){
		queues_holder[debate_name] = [];
	}

	if (!queues_holder[debate_name][debate_side]){
		queues_holder[debate_name][debate_side] = [];
	}
	//queues_holder.trump.push("hello")
	queues_holder[debate_name][debate_side].push(socket.id) //add socket id to list
	console.log("User has joined debate queue ====== " + queues_holder[debate_name][debate_side].length);

	exports.check_debate_queue(debate_name,debate_side);
};


exports.check_debate_queue = function check_debate_queue(debate_name, debate_side){

	if (debate_side == "agree"){
		if(queues_holder[debate_name]["disagree"] && queues_holder[debate_name]["disagree"].length  >= 1){
			exports.create_debate_room(debate_name);
		}else{
			console.log("Not enough people in the " + debate_name + " disagree queue to start a debate.")
		}
	}else{
		if(queues_holder[debate_name]["agree"] && queues_holder[debate_name]["agree"].length >= 1){
			exports.create_debate_room(debate_name);
		}else{
			console.log("Not enough people in the " + debate_name + " agree queue to start a debate.")
		}
	}

	console.log(queues_holder[debate_name][debate_side].length , queues_holder[debate_name]["agree"].length)


};
 
exports.create_debate_room = function create_debate_room(debate_name){
	room_id = exports.randomString(16);
	console.log("New room created", room_id);
	//debate_queue.trump.agree[0]
	for (i = 0; i <= 1; i++) {//get sockets of first 2 people in queue  
    	if (i == 0){
    		current_socket_id = queues_holder[debate_name]["disagree"][0];
    	}else{
    		current_socket_id = queues_holder[debate_name]["agree"][0];
    	}
    	current_socket = socket_list[current_socket_id]; 
    	current_socket.join(room_id);
    	console.log("User joined a new room")
    	room_data = {'debate_name':debate_name,'room_id':room_id};
    	current_socket.emit("joined_room",room_data);
   	}
	//Remove these users from the queue
 	console.log("before: " + queues_holder[debate_name]["agree"])
 	queues_holder[debate_name]["agree"] = queues_holder[debate_name]["agree"].splice(1);//remove the two 
 	queues_holder[debate_name]["disagree"] = queues_holder[debate_name]["disagree"].splice(1);//remove the two  
 	console.log("After: " + queues_holder[debate_name]["agree"])


}


 