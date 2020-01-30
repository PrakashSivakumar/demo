const twilio = require('twilio');
const AccessToken = require('twilio').jwt.AccessToken;

const feathers = require('@feathersjs/feathers');

const configuration = require('@feathersjs/configuration');

let conf = configuration();

let app = feathers()
  .configure(conf);


let twilioToken = (options) => {
  let token = new AccessToken(
    app.get('twilio').accountSid,
    app.get('twilio').sid,
    app.get('twilio').secret
  );
  token.identity = options.identity;
  if(options.mode==='video'){
    let grant = new AccessToken.VideoGrant();
    // grant.room = 'cool room';
    token.addGrant(grant);
  }
  // let grant = new AccessToken.VoiceGrant();
  // // grant.room = 'cool room';
  //
  // token.addGrant(grant);

  return token.toJwt();
};


/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current, params)));
    // }
    // console.log(params)
    return twilioToken(params.query);
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return {id};
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
