const Storage = require('@google-cloud/storage');

const mimeTypes = require('mimetypes');

const readChunk = require('read-chunk');
const fileType = require('file-type');

const isBuffer = require('is-buffer');

const projectId = 'vscript-gcm';// app.get('gcs').projectId;

// Creates a client
const storage = new Storage({
  projectId: projectId,
  keyFilename: 'config/service_key.json'//app.get('gcs').keyFilename
});

const config = {
  action: 'read',
  expires: '03-17-2025',
};

/* eslint-disable no-unused-vars */


function uploadFile(name, auditdata) {

  console.log(auditdata)
  return new Promise(resolve => {
    let fileName;
    let jsondata;
    fileName = name
    jsondata = JSON.stringify(auditdata);
    const bucket = storage.bucket('log-saving');//app.get('gcs').bucket);
    const path = 'logsaving-audit/' + fileName;
    const file = bucket.file(path);
    file.save(jsondata, {
      metadata: {contentType: 'application/json'},
    });
  });
}


class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const result = await uploadFile(params.query.name, data.auditdata);

    return result;
  }

  async update(id, data, params) {
    return Promise.resolve(data);
  }

  async patch(id, data, params) {
    return Promise.resolve(data);
  }

  async remove(id, params) {
    return Promise.resolve({id});
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
