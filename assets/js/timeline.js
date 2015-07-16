var get_job = function(id){
  io.socket.get("/job/" + id, function(data){

  });
}

io.socket.get("/job", function(data, jwer){
  for (var i = data.length - 1; i >= 0; i--) {
    console.log(data[i]);
    var node = document.createElement("LI");
    node.appendChild(document.createTextNode(data[i].name));
    document.getElementById("jobs").appendChild(node);
  };
});

io.socket.on('job', function onServerSentEvent (msg) {
  console.log(msg);
});

