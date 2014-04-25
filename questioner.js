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

module.exports = Q
