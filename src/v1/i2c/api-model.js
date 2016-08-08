var api = {
  debug: {
    v3: {
      CALIBRATE: 'INIT:calibrate',
      TOP: 'INIT:top/[param]',
      BOTTOM: 'INIT:bottom/[param]',
      TOKEN: 'INIT:[id]/[serial]',
      MOVE: 'MOVE:[position]/[speed]',
      UP: 'UP:[steps]',
      DOWN: 'DOWN:[steps]',
      LIGHT: 'LIGHT:[side]/[operation]/[led]/[color]/[brightness]',
      LEVEL: 'LEVEL:[led]/[color]/[brightness]',
      ANIMATION: 'ANI:[animation]/[color]/[brightness]/[speed]',
      STATUS: 'STATUS'
    }
  }
};



// -----------------------------------------------------------------------------

module.exports = {

  // -----------------------------------------------------------------------------
  // MOVEMENT
  getMoveMessage : function(position, speed) {
    var msg = api.debug.v3.MOVE;

    msg = msg.replace("[position]", position)
             .replace("[speed]", speed);

    return msg;
  },
  getUpMessage : function(steps) {
    var msg = api.debug.v3.UP;

    msg = msg.replace("[steps]", steps);

    return msg;
  },
  getDownMessage : function(steps) {
    var msg = api.debug.v3.DOWN;

    msg = msg.replace("[steps]", steps);

    return msg;
  },

  // -----------------------------------------------------------------------------
  // LIGHT & ANIMATION
  getAnimationMessage : function(animation, color, brightness, speed) {
    var msg = api.debug.v3.ANIMATION;

    msg = msg.replace("[animation]", animation)
             .replace("[color]", color)
             .replace("[brightness]", brightness)
             .replace("[speed]", speed);

    return msg;
  },
  getLightMessage : function(side, operation, led, color, brightness) {
    var msg = api.debug.v3.LIGHT;

    msg = msg.replace("[side]", side)
             .replace("[operation]", operation)
             .replace("[led]", led)
             .replace("[color]", color)
             .replace("[brightness]", brightness);

    return msg;
  },
  getLevelMessage : function(led, color, brightness) {
    var msg = api.debug.v3.LEVEL;

    msg = msg.replace("[led]", led)
             .replace("[color]", color)
             .replace("[brightness]", brightness);

    return msg;
  },

  // -----------------------------------------------------------------------------
  // INIT
  getCalibrateMessage : function() {
    var msg = api.debug.v3.CALIBRATE;

    return msg;
  },
  getTokenMessage : function(id, serial) {
    var msg = api.debug.v3.TOKEN;

    msg = msg.replace("[id]", id)
             .replace("[serial]", serial);

    return msg;
  },
  getTopMessage : function(param) {
    var msg = api.debug.v3.TOP;

    msg = msg.replace("[param]", param);

    return msg;
  },
  getBottomMessage : function(param) {
    var msg = api.debug.v3.BOTTOM;

    msg = msg.replace("[param]", param);

    return msg;
  },

  // -----------------------------------------------------------------------------
  // STATUS
  getStatusMessage : function() {
    var msg = api.debug.v3.STATUS;
    return msg;
  }

};
