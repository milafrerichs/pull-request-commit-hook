var exec = require('child_process').exec;

module.exports = function (message, fn) {
  exec("echo \""+message+"\" | git commit --amend --file -", fn);
}
