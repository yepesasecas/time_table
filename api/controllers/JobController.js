module.exports = {
  // [
  //   {
  //   arrival_status: "200"
  //   arrival_time: "2015-07-16T04:03:19.696Z"
  //   arrive: true
  //   callback_url: "http://localhost:1337/job/"
  //   createdAt: "2015-07-16T04:03:16.172Z"
  //   departure_time: "2015-07-12T16:54:00.000Z"
  //   id: 309
  //   name: "job test 1"
  //   response: "REQUEST Response"
  //   updatedAt: "2015-07-16T04:03:19.697Z"
  //   url: "http://www.golazzos.com"
  //   }
  // ]
  index: function(req, res){
    if(req.isSocket) {
      Job.watch(req.socket, "");
      Job.subscribe(req.socket, "");
    }

    Job.find()
      .sort('departure_time')
      .exec(function(err, found){
        var response = {
          database_schedules: found,
          scheduler_schedules: utilServices.schedule
        };
        return res.send(200, response);
    });
  },

  // {
  // arrival_status: "200"
  // arrival_time: "2015-07-16T04:03:19.696Z"
  // arrive: true
  // callback_url: "http://localhost:1337/job/"
  // createdAt: "2015-07-16T04:03:16.172Z"
  // departure_time: "2015-07-12T16:54:00.000Z"
  // id: 309
  // name: "job test 1"
  // response: "REQUEST Response"
  // updatedAt: "2015-07-16T04:03:19.697Z"
  // url: "http://www.golazzos.com"
  // }
  show:function(req, res){
    Job.find(req.param("id")).exec(function(err, found){
      console.log(found[0]);
      return res.send(200, found[0]);
    });
  },

  // {
  //     "name": "job test"
  //     "departure_time": {
  //         "year": 2015,
  //         "month": 7,
  //         "day": 11,
  //         "hour": 17,
  //         "min": 47,
  //         "second": 0,
  //         "mili_second": 0
  //     },
  //     "task": {
  //         "method": "get",
  //         "url": "www.google.com",
  //         "params": "",
  //         "callback_url": "my.domain.com"
  //     }
  // }
  create: function(req, res){

    var schedule = utilServices.schedule;
    var request  = utilServices.request;

    try{
      var job = Job.new_job(req.body);

      console.log(job);
      console.log("N: " + new Date(Date.now()));

      // Create Job
      Job.create(job).exec(function(err, created){
        if(err) return res.send(403, err);

        // Publish Job Created to Browsers
        Job.publishCreate({id: created.id});

        // Schedule Job
        var j = schedule.scheduleJob(job.name, job.departure_time, function(){

          // Request Job Url
          request(job.url, function(err, response, body){

            // Update Job Response
            Job.update(created.id, {
              arrive: true,
              arrival_status: (err) ? null : response.statusCode,
              arrival_time: myDate.now(),
              response: (err) ? err : body
            }).exec(function(err, found){

              //Publish Job Update to Browsers
              Job.publishUpdate(created.id);

              // Send Job Response to callback URL
              while(found.length){
                var job_updated = found.pop();
                request({
                  method: "POST",
                  url: job_updated.callback_url,
                  body: job_updated.job_updated
                });
              }

            });
          });
        });

        return res.send(201, created);
      });
    }
    catch(e){
      console.log("Catch, responding 400. Error message: " + e);
      return res.send(400, "Invalid JSON POST. Please Read Documentation!!! --- Error message: " + e);
    }
  }
};
