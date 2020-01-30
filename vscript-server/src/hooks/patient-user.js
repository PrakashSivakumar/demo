// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars

function patientUser(context) {
  return new Promise((resolve, reject) => {

    let user = context.params.user;

    let patient = JSON.parse(JSON.stringify(context.data));
    console.log('methods', patient)
    if (context.method === 'create') {
      context.app.service('users').create({

        username: patient.contact.phone.substring(2),
        password: patient.contact.phone.substring(2),
        name: {
          firstName: patient.name.firstName,
          lastName: patient.name.lastName,
          middleName: patient.name.middleName,
        },
        details: {
          pharmacy_id: user.details.pharmacy_id,
          patient_id: context.result._id,
        },
        roles: ['patient'],
        accessControls: ['create', 'view'],
      });

      console.log("haihjgjhg",patient.contact.phone);
      resolve(context);
    } /*else if (context.method === 'patch') {
      console.log('usersData', patient)
      context.app.service('users').update({username: patient.contact.phone}, {
        username: patient.contact.phone,
        password: patient.contact.phone,
        name: {
          firstName: patient.name.firstName,
          lastName: patient.name.lastName,
          middleName: patient.name.middleName,
        },
        details: {
          pharmacy_id: user.details.pharmacy_id,
          patient_id: patient.id,
        }
      }, {upsert: true});
    }*/
  });
}


module.exports = function (options = {}) {
  return async context => {
    let createPatientUser = await patientUser(context);
    return context;
  };
};
