var exec = require('child_process').exec;

module.exports = function (message, fn) {
  exec("git log -1 --pretty=%B", function(err, stdout, stderr){
    exec("echo \""+stdout+"\n\n"+message+"\" | git commit --amend --file -", fn);
  });
}
