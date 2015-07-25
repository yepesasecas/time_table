var create_job_decorator = function(job){
  var job_decorator = job;

  if(job.arrive){
    if(job.arrival_status){
      job_decorator.arrival_status    = job.arrival_status;
      job_decorator.status_background = "background-green";
      job_decorator.response          = "Click to see response.";
    }else{
      job_decorator.arrival_status    = "";
      job_decorator.status_background = "background-red";
      job_decorator.response          = job.response;
    }
  }else{
    job_decorator.arrival_status    = "";
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

var get_timeline = function(data){
  console.log(data);
  var database_jobs = data.database_schedules;
  for (var i = 0; i < database_jobs.length; i++) {
    $("#cd-timeline").prepend(create_job_view(database_jobs[i]));
  };
  $(".cd-container").prepend(JSON.stringify(data.scheduler_schedules));
}

var get_job = function(id){
  io.socket.get("/job/" + id, function(new_job){
    var job_view = $(".job-" + new_job.id);
    if(job_view.length){
      job_view.replaceWith(create_job_view(new_job));
    }
    else{
      $("#cd-timeline").prepend(create_job_view(new_job));
    }
  });
}

io.socket.get("/job", function(data, jwer){
  get_timeline(data);
});

io.socket.on('job', function onServerSentEvent(msg){
  get_job(msg.id);
});

io.socket.on('disconnect', function(){
  console.log('Lost connection to server');
});
