#!/usr/bin/env node
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

function Q (questions) {
  this._i = 0;
  this.questions = questions;
}
Q.prototype.nextQuestion = function () {
  this._i++;
  if (this._i >= this.questions.length)
    return false
  else {
    console.log(this.questions[this._i]);
    return true
  }
}
Q.prototype.getCurrent = function() {
  return this.questions[this._i];
}

function addPrefixToEach(toPrefix, prefix) {
  elements = toPrefix.split(",");
  elements.join(prefix);
}

function ammendMessage(message) {
  console.log(message);
  exec("echo \""+message+"\" | git commit --amend --file -",function(err,stdout,sterr) {
    console.log(err,stdout,sterr);
  });
}

path = pathChecking();
if(!path) {
  console.warn("No PR Template");
  return process.exit(1);
}
var template = require(path);
var headlines = new Q(template["headlines"]);
var commits = new Iterator(template["commits"]);
var notifiers = new Iterator(template["notifiers"]);
var message = "";
var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = 'GH-T: > ';

rl.on('line', function(line) {
  if(line.length > 0)
    message += "##"+headlines.getCurrent()+"\n"+line+"\n";
  if (!headlines.nextQuestion()){ return rl.close() }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  ammendMessage(message);
});

console.log(prefix + headlines.getCurrent());
rl.setPrompt(prefix, prefix.length);
rl.prompt();
