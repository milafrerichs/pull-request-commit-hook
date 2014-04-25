#!/usr/bin/env node
var fs = require('fs'),
readline = require('readline'),
Q = require('./questioner'),
ammendMessage = require('./ammender'),
path;

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

function addPrefixToEach(toPrefix, prefix) {
  elements = toPrefix.split(",");
  elements.join(prefix);
}

path = pathChecking();
if(!path) {
  console.warn("No PR Template");
  return process.exit(1);
}

var template = require(path),
headlines = new Q(template.headlines),
message = "",
readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout),
prefix = 'GH-T: > ';

rl.on('line', function(line) {
  if(line.length > 0)
    message += "PR with Template\n"+headlines.getCurrent()+"\n---------\n"+line+"\n";
  if (!headlines.nextQuestion()){ return rl.close() }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  ammendMessage(message, function (err, stdout, stderr) {
    if (err) throw err;
    console.log(stdout)
  });
});

console.log(prefix + headlines.getCurrent());
rl.setPrompt(prefix, prefix.length);
rl.prompt();
