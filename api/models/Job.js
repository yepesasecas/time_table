/**
* Job.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type: "string",
      required: true
    },

    arrive:{
      type: "boolean",
      required: true
    },

    url:{
      type: "string",
      required: true
    },

    callback_url:{
      type: "string",
      required: true
    },

    departure_time:{
      type: "date",
      required: true
    },

    arrival_time:{
      type: "date"
    }
  }
};

