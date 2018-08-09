// Agent library.
var Agent = { };


(function(global) {
  'use strict';
  
  // Agent constructor.
  var Agent = function(maxWidth, maxHeight, maxRadius, centroidX, centroidY, gaussianRandom) {

    // Save the dimensiosn of the screen for use when acting.
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;

    this.centroidX = centroidX;
    this.centroidY = centroidY;

    this.x = Math.random() * maxWidth;
    this.y = Math.random() * maxHeight;
    this.radius = (Math.random() * maxRadius) + 5;
    this.vx = (Math.random() * 50) * 0.04 - 0.05;
    this.vy = (Math.random() * 50) * 0.04 - 0.05;
    this.prevDistance = 3000;
    this.color = '#ffffff';
    this.opacity = gaussianRandom();
    this.originalOpacity = this.opacity;
  }

  Agent.prototype = {

    act: function(action, velocityFactor = 1) {

      if (action == 0) 
        this.x += (this.vx * velocityFactor)
      else if (action == 1) 
        this.x -= (this.vx * velocityFactor)
      else if (action == 2) 
        this.y += (this.vy * velocityFactor)
      else 
        this.y -= (this.vy * velocityFactor)

      if (this.x > this.maxWidth)
        this.x = this.maxWidth - 10;
      else if (this.x < 0)
        this.x = 10;

      if (this.y > this.maxHeight)
        this.y = this.maxHeight - 10;
      else if (this.y < 0)
        this.y = 10;
    },

    distance: function() {

      let dx = this.x - this.centroidX,
        dy = this.y - this.centroidY;

      return Math.sqrt((dx * dx) + (dy * dy));
    },

    getState: function() {
      return [this.x, this.y];
    },

    slow: function(factor = 2) {
      this.vx /= factor;
      this.vy /= factor;
    }
  }

  global.Agent = Agent;
})(Agent);

export { Agent };
