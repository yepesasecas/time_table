var create_job_decorator = function(job){
  var job_decorator = job;

  if(job.arrive){
    if(job.arrival_status){
      job_decorator.arrival_status    = job.arrival_status;
      job_decorator.status_background = "background-green";
      job_decorator.response          = "Click to see response.";
    }else{
      job_decorator.arrival_status    = "Error";
      job_decorator.status_background = "background-red";
      job_decorator.response          = job.response;
    }
  }else{
    job_decorator.arrival_status    = "...";
    job_decorator.status_background = "background-yellow";
    job_decorator.response          = "Job Scheduled.";
  }
  return job_decorator;
}

var create_job_view = function(job){
  var job_decorator = create_job_decorator(job);
  var job_view= $(document.createElement('div'))
    .addClass("job-" + job_decorator.id)
    .addClass("cd-timeline-block")
    .append($(document.createElement('div'))
      .addClass(job_decorator.status_background)
      .addClass("cd-timeline-img")
      .append($(document.createElement('p'))
        .addClass("cd-timeline-status")
        .text(job_decorator.arrival_status)
    ))
    .append($(document.createElement('div'))
      .addClass("cd-timeline-content")
        .append($(document.createElement('h2'))
          .text(job_decorator.name)
        )
        .append($(document.createElement('p'))
          .text("Url: " + job_decorator.url)
        )
        .append($(document.createElement('p'))
          .text("Callback: " + job_decorator.callback_url)
        )
        .append($(document.createElement('p'))
          .text(job_decorator.response)
        )
        .append($(document.createElement('span'))
          .addClass("cd-date")
          .text((new Date(job_decorator.departure_time)).toString())
        )
    );
  return job_view;
}

var get_job = function(id, cb){
  io.socket.get("/job/" + id, function(data){
    console.log(data);
    cb(data);
  });
}

io.socket.get("/job", function(data, jwer){
  for (var i = 0; i < data.length; i++) {
    var job = data[i];
    $("#cd-timeline").prepend(create_job_view(job));
  };
});

io.socket.on('job', function onServerSentEvent(msg){
  get_job(msg.id, function(new_job){
    var job_view = $(".job-" + new_job.id);
    job_view.remove();
    $("#cd-timeline").prepend(create_job_view(new_job));
  });
});
