// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

var SquareConnect = require('square-connect');
var defaultClient = SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = "sandbox-sq0atb-snt8xvgJC_gHeGMA5od1Ag";

let apiInstance;
let body;
let result;
let opts;

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    console.log(context.params.query.endPoint)

    let endPoint = context.params.query.endPoint;

    switch(endPoint) {
      case 'createCustomer':
        apiInstance = new SquareConnect.CustomersApi();
        body = new SquareConnect.CreateCustomerRequest();
        result = await apiInstance.createCustomer(body);
        break;
      case 'listLocations':
        apiInstance = new SquareConnect.LocationsApi();
        result = await apiInstance.listLocations();
        break;
      case 'obtainToken':
        apiInstance = new SquareConnect.OAuthApi();
        body = new SquareConnect.ObtainTokenRequest();
        result = await apiInstance.obtainToken(body);
        break;
      case 'renewToken':
        apiInstance = new SquareConnect.OAuthApi();
        body = new SquareConnect.RenewTokenRequest();
        var clientId = "clientId_example"; // String | Your application's ID, available from the [application dashboard](https://connect.squareup.com/apps).
        result = await apiInstance.renewToken(clientId, body);
        break;
      case 'createEmployee':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = new SquareConnect.V1Employee();
        result = await apiInstance.createEmployee(body);
        break;
      case 'createEmployeeRole':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = new SquareConnect.V1EmployeeRole();
        result = await apiInstance.createEmployeeRole(body);
        break;
      case 'createTimecard':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = new SquareConnect.V1Timecard();
        result = await apiInstance.createTimecard(body);
        break;
      case 'deleteTimecard':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = "timecardId_example";
        result = await apiInstance.deleteTimecard();
        break;
      case 'listEmployeeRoles':
        apiInstance = new SquareConnect.V1EmployeesApi();
        opts = {
          'order': "order_example", // String | The order in which employees are listed in the response, based on their created_at field.Default value: ASC
          'limit': 56, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
          'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
        };
        result = await apiInstance.listEmployeeRoles(opts);
        break;
      case 'listEmployees':
        apiInstance = new SquareConnect.V1EmployeesApi();
        opts = {
          'order': "order_example", // String | The order in which employees are listed in the response, based on their created_at field.      Default value: ASC
          'beginUpdatedAt': "beginUpdatedAt_example", // String | If filtering results by their updated_at field, the beginning of the requested reporting period, in ISO 8601 format
          'endUpdatedAt': "endUpdatedAt_example", // String | If filtering results by there updated_at field, the end of the requested reporting period, in ISO 8601 format.
          'beginCreatedAt': "beginCreatedAt_example", // String | If filtering results by their created_at field, the beginning of the requested reporting period, in ISO 8601 format.
          'endCreatedAt': "endCreatedAt_example", // String | If filtering results by their created_at field, the end of the requested reporting period, in ISO 8601 format.
          'status': "status_example", // String | If provided, the endpoint returns only employee entities with the specified status (ACTIVE or INACTIVE).
          'externalId': "externalId_example", // String | If provided, the endpoint returns only employee entities with the specified external_id.
          'limit': 56, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
          'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
        };
        result = await apiInstance.listEmployees(opts);
        break;
      case 'listTimecardEvents':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = "timecardId_example";
        result = await apiInstance.listTimecardEvents(body);
        break;
      case 'listTimecards':
        apiInstance = new SquareConnect.V1EmployeesApi();
        opts = {
          'order': "order_example", // String | The order in which timecards are listed in the response, based on their created_at field.
          'employeeId': "employeeId_example", // String | If provided, the endpoint returns only timecards for the employee with the specified ID.
          'beginClockinTime': "beginClockinTime_example", // String | If filtering results by their clockin_time field, the beginning of the requested reporting period, in ISO 8601 format.
          'endClockinTime': "endClockinTime_example", // String | If filtering results by their clockin_time field, the end of the requested reporting period, in ISO 8601 format.
          'beginClockoutTime': "beginClockoutTime_example", // String | If filtering results by their clockout_time field, the beginning of the requested reporting period, in ISO 8601 format.
          'endClockoutTime': "endClockoutTime_example", // String | If filtering results by their clockout_time field, the end of the requested reporting period, in ISO 8601 format.
          'beginUpdatedAt': "beginUpdatedAt_example", // String | If filtering results by their updated_at field, the beginning of the requested reporting period, in ISO 8601 format.
          'endUpdatedAt': "endUpdatedAt_example", // String | If filtering results by their updated_at field, the end of the requested reporting period, in ISO 8601 format.
          'deleted': true, // Boolean | If true, only deleted timecards are returned. If false, only valid timecards are returned.If you don't provide this parameter, both valid and deleted timecards are returned.
          'limit': 56, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
          'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
        };
        result = await apiInstance.listTimecards(opts);
        break;
      case 'retrieveEmployee':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = "employeeId_example";
        result = await apiInstance.retrieveEmployee(body);
        break;
      case 'retrieveEmployeeRole':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = "roleId_example";
        result = await apiInstance.retrieveEmployeeRole(body);
        break;
      case 'retrieveTimecard':
        apiInstance = new SquareConnect.V1EmployeesApi();
        body = "timecardId_example";
        result = await apiInstance.retrieveTimecard(body);
        break;
      case 'updateEmployee':
        apiInstance = new SquareConnect.V1EmployeesApi();
        let employeeId = "employeeId_example";
        body = new SquareConnect.V1Employee();
        result = await apiInstance.updateEmployee(employeeId, body);
        break;
      case 'updateEmployeeRole':
        apiInstance = new SquareConnect.V1EmployeesApi();
        let roleId = "roleId_example";
        body = new SquareConnect.V1Employee();
        result = await apiInstance.updateEmployeeRole(roleId, body);
        break;
      case 'updateTimecard':
        apiInstance = new SquareConnect.V1EmployeesApi();
        let timecardId = "timecardId_example";
        body = new SquareConnect.V1Timecard();
        result = await apiInstance.updateTimecard(timecardId, body);
        break;

    }
    // let result = await api.listLocations();
    // let result = await apiInstance.createTimecard()
    console.log(result)
    context.result = result
    return context;
  };
};
