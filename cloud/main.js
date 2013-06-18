
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hook", function(request, response) {

  // Send message data to new Email parse object

  // TODO fill in your account id
  var finalUrl = 'https://api.context.io/2.0/accounts//messages/' +
      request.params.message_data.message_id + '/body';

  var OAuth = require('cloud/oauth').OAuth;
  var consumerKey = ''; // TODO fill in your key
  var consumerSecret = ''; // TODO fill in your consumer:w
  var oa = new OAuth(finalUrl, finalUrl, consumerKey, consumerSecret, "1.0", null, "HMAC-SHA1");
  oa.setClientOptions({ requestTokenHttpMethod: 'GET' });

  var orderedParameters= oa._prepareParameters('', '', 'GET', finalUrl, null);
  var headers= {};
  var authorization = oa._buildAuthorizationHeaders(orderedParameters);
  headers["Authorization"] = authorization;

  Parse.Cloud.httpRequest({
    url: finalUrl,
    headers: headers,
    success: function(httpResponse) {
      var Email = Parse.Object.extend("Email");
      var email = new Email();

      email.set("subject", request.params.message_data.subject);
      email.set("date", request.params.message_data.date);
      email.set("body", httpResponse.data[0].content);
      email.save(null, {
        success: function() {
          response.success();
        },
        error: function(email, error) {
          response.error(error);
        }
      });
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });


});
