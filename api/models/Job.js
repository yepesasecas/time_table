/**
* Job.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    arrive:{
      type: "boolean",
      required: true
    },

    arrival_status:{
      type: "string"
    },

    arrival_time:{
      type: "date"
    },

    callback_url:{
      type: "string",
      required: true
    },

    departure_time:{
      type: "date",
      required: true
    },

    name:{
      type: "string",
      required: true
    },

    response:{
      type: "text"
    },

    url:{
      type: "string",
      required: true
    }
  },

  new_job: function(params){
    var job = params;
    job["departure_time"] = myDate.create(params["departure_time"]);
    job["arrive"] = false;
    return job;
  }
};

