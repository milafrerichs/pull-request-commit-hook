var fs = require('fs')
var readline = require('readline');
var Iterator = require('js-array-iterator');
var exec = require('child_process').exec;
var path;

function pathChecking() {
  var homePath, currentPath;
  homePath = "~/.pr.template.json";
  currentPath = __dirname+"/.pr.template.json";
  if(fs.existsSync(homePath)) {
    return homePath;
  }else if(fs.existsSync(currentPath)) {
    return currentPath;
  }else {
    return false;
  }
}

function buildMessage(iterator,prefix) {
  iterator.on('next', function(element) {
    console.log(">"+element);
    rl.on("line",  function(answer) {
      rl.setPrompt(">",1);
      rl.prompt();
      if(answer.length > 0) {
        message += prefix+element+"\n"+answer+"\n";
      }
      iterator.next();
    });
  });
  iterator.next();
}

function ammendMessage(argument) {
  exec("echo '"+message+"' | git commit --amend --file -",function(err,stdout,sterr) {
    console.log(err,stdout,sterr);
  });
}

path = pathChecking();
if(!path) {
  console.warn("No PR Template");
  return process.exit(1);
}
var template = require(path);
var headlines = new Iterator(template["headlines"]);
var commits = new Iterator(template["commits"]);
var notifiers = new Iterator(template["notifiers"]);
var message = "";
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
buildMessage(headlines, "##");
headlines.on("end", function() {
  buildMessage(commits, "#");
  rl.close();
  ammendMessage();
});
rl.setPrompt(">",1);
rl.prompt();
