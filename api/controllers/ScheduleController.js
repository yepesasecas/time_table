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

module.exports = {
  index: function(req, res){

  },

  create: function(req, res){
    var schedule = utilServices.schedule;
    var job = req.body;
    var departure_json = req.param("departure_time");
    var date = new Date(
      departure_json.year,
      departure_json.month,
      departure_json.day,
      departure_json.hour,
      departure_json.min,
      departure_json.second,
      departure_json.mili_second
    );
    job["departure_time"] = date;
    job["arrive"] = false;

    console.log(job);
    console.log("N: " + new Date(Date.now()));
    console.log("S: " + date);

    Job.create(job).exec(function(err, created){
      if(err) return res.send(403, err);
      console.log("Job created: " + created.name);

      var j = schedule.scheduleJob(date, function(){
        console.log('The world is going to end today.');
        Job.update(created.id, {arrive: true}).exec(function(err, found){
          console.log("updated: " + found);
        });
      });

      return res.send(201, created);
    });
  }
};
