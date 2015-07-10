module.exports = {
  hi: function (req, res) {
    var schedule = utilServices.schedule;
    var date = new Date(2015, 6, 9, 23, 36, 0);
    console.log(new Date(Date.now()));
    console.log(date);

    var j = schedule.scheduleJob(date, function(){
        console.log('The world is going to end today.');
    });

    return res.send(utilServices.schedule);
  },

  bye: function (req, res) {
    return res.redirect("http://www.sayonara.com");
  }
};
