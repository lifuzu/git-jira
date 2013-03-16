var fs = require('fs');
var read = require('read');

function getAllHeaders(callback) {
  var headers = {};
  headers['Content-Type'] = 'application/json';
  getAuthorizationHeader(function(authenticationHeader) {
    headers['Authorization'] = authenticationHeader;
    callback(headers);
  });
}

function getHeaderData(authenticationString) {
  return ('Basic ' + new Buffer(authenticationString).toString('base64'));
}

function getAuthorizationHeader(callback) {
  var authenticationString = '';
  var filename = './.git/info/.git-jira';
  if (!fs.existsSync(filename)) {
    getUserNamePassword(function(username, password) {
      var authenticationString = username + ':' + password;
      fs.writeFileSync(filename, authenticationString);
      callback(getHeaderData(authenticationString));
    });
  } else {
    authenticationString = fs.readFileSync(filename);
    callback(getHeaderData(authenticationString));
  }
}

function getUserNamePassword(callback) {
  var username = '';
  var password = '';
  if (process && process.env && process.env['USER']) {
    username = process.env['USER'];
  } else {
    throw "No USER variable set in Environment";
  }
  read({ prompt: 'Password: ', silent: true }, function(err, data) {
    if (err) {
      throw err;
    }
    password = data;
    callback(username, password);
  });
}

module.exports.getAllHeaders = getAllHeaders;