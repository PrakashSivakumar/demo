// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options={}) {
  return async context => {
    console.log('sync started...!');

    // let packages = context.app.service('vehicle-details').Model;
    //   let stream = packages.synchronize();
    //   let count = 0;
    //
    // stream.on('data', function (err, doc) {
    //   count++;
    // });
    // stream.on('close', function(){
    //   console.log('indexed ' + count + ' documents!');
    // });
    // stream.on('error', function(err){
    //   console.log(err);
    // });
    // context.result = 'Done!';

    return context;
  };
};
