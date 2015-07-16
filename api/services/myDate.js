module.exports = {
  create: function(departure_time){
    var date = new Date(
      departure_time.year,
      departure_time.month,
      departure_time.day,
      departure_time.hour,
      departure_time.min,
      departure_time.second,
      departure_time.mili_second
    );
    return date;
  },
  now: function(){
    return new Date(Date.now());
  }
}
