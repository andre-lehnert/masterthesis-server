var api = {
  debug: {
    v2: {
      CALIBRATE: 'INIT:calibrate',
      TOP: 'INIT:top/[param]',
      BOTTOM: 'INIT:bottom/[param]',
      TOKEN: 'INIT:[id]/[serial]',
      MOVE: 'MOVE:[position]/[speed]',
      UP: 'UP:[steps]',
      DOWN: 'DOWN:[steps]',
      LIGHT: 'LIGHT:[side]/[operation]/[led]/[color]/[brightness]',
      ANIMATION: 'ANI:[animation]/[color]/[brightness]/[speed]'
    }
  }
};



// -----------------------------------------------------------------------------

module.exports = {

  // -----------------------------------------------------------------------------
  // MOVEMENT
  getMoveMessage : function(position, speed) {
    var msg = api.debug.v2.MOVE;

    msg = msg.replace("[position]", position)
             .replace("[speed]", speed);

    return msg;
  },
  getUpMessage : function(steps) {
    var msg = api.debug.v2.UP;

    msg = msg.replace("[steps]", steps);

    return msg;
  },
  getDownMessage : function(steps) {
    var msg = api.debug.v2.DOWN;

    msg = msg.replace("[steps]", steps);

    return msg;
  },

  // -----------------------------------------------------------------------------
  // LIGHT & ANIMATION
  getAnimationMessage : function(animation, color, brightness, speed) {
    var msg = api.debug.v2.ANIMATION;

    msg = msg.replace("[animation]", animation)
             .replace("[color]", color)
             .replace("[brightness]", brightness)
             .replace("[speed]", speed);

    return msg;
  },
  getLightMessage : function(side, operation, led, color, brightness) {
    var msg = api.debug.v2.LIGHT;

    msg = msg.replace("[side]", side)
             .replace("[operation]", operation)
             .replace("[led]", led)
             .replace("[color]", color)
             .replace("[brightness]", brightness);

    return msg;
  },

  // -----------------------------------------------------------------------------
  // INIT
  getCalibrateMessage : function() {
    var msg = api.debug.v2.CALIBRATE;

    return msg;
  },
  getTokenMessage : function(id, serial) {
    var msg = api.debug.v2.TOKEN;

    msg = msg.replace("[id]", id)
             .replace("[serial]", serial);

    return msg;
  },
  getTopMessage : function(param) {
    var msg = api.debug.v2.TOP;

    msg = msg.replace("[param]", param);

    return msg;
  },
  getBottomMessage : function(param) {
    var msg = api.debug.v2.BOTTOM;

    msg = msg.replace("[param]", param);

    return msg;
  }

};
