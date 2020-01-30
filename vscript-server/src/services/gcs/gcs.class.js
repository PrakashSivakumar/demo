/* eslint-disable no-unused-vars */

const Storage = require('@google-cloud/storage');

const mimeTypes = require('mimetypes');

const readChunk = require('read-chunk');
const fileType = require('file-type');

const isBuffer = require('is-buffer');

// const app = require('./../../app');


// Your Google Cloud Platform project ID
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


function uploadFile(name, base64) {
  return new Promise(resolve => {
    let fileName;
    let imageBuffer;
    let mimeType;
    console.log('type', isBuffer(base64));
    if (isBuffer(base64)) {
      mimeType = fileType(base64).mime;
      fileName = name + '.' + fileType(base64).ext;
      imageBuffer = base64;
    } else {
      let image = base64;
      mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
      fileName = name + '.' + mimeTypes.detectExtension(mimeType);
      base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = new Buffer(base64EncodedImageString, 'base64');
    }


    // // Creates a client
    // const storage = new Storage({
    //   projectId: projectId,
    // });

    const bucket = storage.bucket('vscript');//app.get('gcs').bucket);
    const path = 'rx-images/' + fileName;

    const file = bucket.file(path);

    file.save(imageBuffer, {
      metadata: {contentType: mimeType},
      validation: 'md5'
    }).then(() => {
      file.getSignedUrl(config).then(function (data) {
        const url = data[0];
        resolve({
          // path:path,
          url: url
        });
      }).catch(error => console.log('error', error));

    }).catch(error => {
      console.log(error);
    });
  });
}


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

    const result = await uploadFile(params.query.name, data.uri);

    return result;
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
