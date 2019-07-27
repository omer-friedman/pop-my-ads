function Stopwatch(config) {
  config = config || {};
  this.element = config.element || {};
  this.next_bounce = config.next_bounce;
  this.previousTime = config.previousTime || new Date().getTime();
  this.paused = config.paused && true;
  this.elapsed = config.elapsed || 0;
  this.countingUp = config.countingUp && true;
  this.timeLimit = config.timeLimit;
  this.updateRate = config.updateRate || 100;
  this.onTimeUp = config.onTimeUp;
  this.onTimeUpdate = config.onTimeUpdate;
  this.onStop = config.onStop;
  if (!this.paused) {
    this.start();
  }
}


Stopwatch.prototype.start = function() {
  this.paused = false;
  this.previousTime = new Date().getTime();
  this.keepCounting();
};

Stopwatch.prototype.keepCounting = function() {
  var btn_popstop_content = document.getElementById("btn_popstop").innerHTML;
  if(btn_popstop_content == "POP MY ADS!")
    this.onStop();
  if (this.paused) {
    return true;
  }
  var now = new Date().getTime();
  var diff = (now - this.previousTime);
  if (!this.countingUp) {
    diff = -diff;
  }
  this.elapsed = this.elapsed + diff;
  this.previousTime = now;
  this.onTimeUpdate();
  if ((this.elapsed >= this.timeLimit && this.countingUp) || (this.elapsed <= this.timeLimit && !this.countingUp)) {
    this.stop();
    this.onTimeUp();
    return true;
  }
  var that = this;
  setTimeout(function() {
    that.keepCounting();
  }, this.updateRate);
};

Stopwatch.prototype.stop = function() {
  this.paused = true;
};


function start_countdown(countdown_elem){
    var next_bounce = countdown_elem.innerHTML;
    var countdown_time = getDiffTime(next_bounce);
    if(!countdown_time.includes(':'))
        return
    var elapsed_milliseconds = Number(countdown_time.split(':')[0]) * 60 * 60 * 1000 +Number(countdown_time.split(':')[1]) * 60 * 1000 + Number(countdown_time.split(':')[2]) * 1000;
    var stopwatch = new Stopwatch({
        'element': this,                  // DOM element
        'next_bounce': next_bounce,       // next bounce time
        'paused': false,                  // Status
        'elapsed': elapsed_milliseconds,  // Current time in milliseconds
        'countingUp': false,              // Counting up or down
        'timeLimit': 0,                   // Time limit in milliseconds
        'updateRate': 100,                // Update rate, in milliseconds
        'onTimeUp': function() {          // onTimeUp callback
            this.stop();
            start_popping_ads()
        },
        'onTimeUpdate': function() {      // onTimeUpdate callback
            var t = this.elapsed,
                h = ('0' + Math.floor(t / 3600000)).slice(-2),
                m = ('0' + Math.floor(t % 3600000 / 60000)).slice(-2),
                s = ('0' + Math.floor(t % 60000 / 1000)).slice(-2);
            var formattedTime = h + ':' + m + ':' + s;
            countdown_elem.innerHTML = formattedTime;
        },
        'onStop': function(){
            this.stop();
            $(countdown_elem).parent().text(this.next_bounce);
        }
    });
}